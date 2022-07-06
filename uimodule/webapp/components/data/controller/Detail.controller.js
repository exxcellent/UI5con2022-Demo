sap.ui.define([
    "./BaseController",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/ui/core/Element"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessagePopover, MessageItem, Element) {
        "use strict";

        return Controller.extend("de.exxcellent.ui5con.Data.controller.Detail", {
            onInit: function () {
                this.getRouter().getRoute("edit").attachPatternMatched(this._onObjectMatched, this);
                this.createMessagePopover();
            },

            _onObjectMatched(oEvent) {
                const sPath = decodeURIComponent(oEvent.getParameter("arguments")?.id);
                this.getView().bindElement(sPath);
            },

            closeDetail() {
                this.navTo("list");
            },

            onApprovalChanged(oEvent) { 
                // I'm cheating a bit here: since this sample doesn't use any persistent storage from where the component could load its data and write updates to,
                // other instances of this component will not have their data updated.
                // So I'm using the global EventBus to not only notify potential other instances about updated data being available, but to also send the updated data with it
                const sPath = oEvent.getSource().getBindingContext().getPath();
                sap.ui.getCore().getEventBus().publish("data", "approvalChanged", {
                    path: sPath,
                    data: this.getModel().getProperty(sPath)
                });
            },

            onDirtyStateSelected(bIsSelected) {
                this.getOwnerComponent().fireNotifyPendingChanges({
                    hasPendingChanges: bIsSelected
                });
            },

            
/**************************************************************************************************************
 * From here on out it's just code from the MessagePopover sample 
 * found at https://ui5.sap.com/#/entity/sap.m.MessagePopover/sample/sap.m.sample.MessagePopoverMessageHandling
 */
            handleMessagePopoverPress: function (oEvent) {
                if (!this.oMP) {
                    this.createMessagePopover();
                }
                this.oMP.toggle(oEvent.getSource());
            },

            createMessagePopover: function () {
                var that = this;
    
                this.oMP = new MessagePopover({
                    activeTitlePress: function (oEvent) {
                        var oItem = oEvent.getParameter("item"),
                            oPage = that.getView().byId("page"),
                            oMessage = oItem.getBindingContext("message").getObject(),
                            oControl = Element.registry.get(oMessage.getControlId());
    
                        if (oControl) {
                            oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
                            setTimeout(function(){
                                oControl.focus();
                            }, 300);
                        }
                    },
                    items: {
                        path:"message>/",
                        template: new MessageItem(
                            {
                                title: "{message>message}",
                                subtitle: "{message>additionalText}",
                                groupName: "Status",
                                activeTitle: {parts: [{path: 'message>controlIds'}], formatter: this.isPositionable},
                                type: "{message>type}",
                                description: "{message>message}"
                            })
                    },
                    groupItems: true
                });
    
                this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
            },

            isPositionable : function (sControlId) {
                // Such a hook can be used by the application to determine if a control can be found/reached on the page and navigated to.
                return sControlId ? true : true;
            },
        });
    }
);
