sap.ui.define([
    "sap/ui/core/UIComponent", "de/exxcellent/ui5con/Data/model/models",
    "sap/ui/core/message/MessageManager",
    "sap/ui/core/mvc/XMLView"
],
    /**
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     */
    function (UIComponent, models, MessageManager, XMLView) {
        "use strict";

        return UIComponent.extend("de.exxcellent.ui5con.Data.Component", {
            metadata: {
                manifest: "json",
                interfaces: ["sap.ui.core.IAsyncContentCreation"],
                events: {
                    /**
                     * Relay navigation information to an outside application context - allows the component to request navigation from the application that embeds it
                     */
                    requestNavigate: {
                        parameters: {
                            route: { type: "string" },
                            componentTargetInfo: { type: "object" }
                        }
                    },
                    /**
                     * Notify the outside application context about unsaved changes that exist within the component - allows the application that embeds it to consider this before navigating away
                     */
                    notifyPendingChanges: {
                        parameters: {
                            hasPendingChanges: { type: "boolean" }
                        }
                    },
                }
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // make the configured operation mode available througout the component
                this.setModel(models.createModeModel(this.getComponentData()?.mode), "mode");

                // enable routing
                // this.getRouter().initialize();   // Here, it will lead to an error if an embedded component version via createContent does not have a routing control
                                                    // The call is therefore relegated to createContent()

                this._registerMessageManager();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                this._loadData();
            },

            _loadData() {
                const sDataUrl = sap.ui.require.toUrl("de/exxcellent/ui5con/Data/model/data.json");
                this.getModel().loadData(sDataUrl);
            },

            _registerMessageManager() {
                // const oMessageManager = sap.ui.getCore().getMessageManager(); // Comment in this line while commenting out the next to reproduce message conflicts when using the component multiple times with different operation modes
                const oMessageManager = new MessageManager();
                oMessageManager.registerObject(this, true);
                this.setModel(oMessageManager.getMessageModel(), "message");
            },

            createContent() {
                /**
                 * Different output formats for embedding
                 */
                if (this.getComponentData() && this.getComponentData().embed) {
                    if (this.getComponentData().embed === "requiredApprovalsButton") {
                        return XMLView.create({
                            viewName: "de.exxcellent.ui5con.Data.embeddable.RequiredApprovalsButton"
                        });
                    } else if (this.getComponentData().embed === "requiredApprovalsCard") {
                        return XMLView.create({
                            viewName: "de.exxcellent.ui5con.Data.embeddable.RequiredApprovalsCard"
                        });
                    }
                /**
                 * Standard use
                 */
                } else {
                    this.getRouter().initialize();
                    return UIComponent.prototype.createContent.apply(this, arguments);
                }
            }
        });
    }
);
