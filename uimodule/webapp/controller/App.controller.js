sap.ui.define(
    ["de/exxcellent/ui5con/Demo/controller/BaseController",
        "sap/base/Log",
        "sap/m/MessageBox"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} BaseController
     */
    function (BaseController, Log, MessageBox) {
        "use strict";


/*********************************************************************************************************************************
 * All function in this controller serve to showcase a very basic possibility of handling a dirty state in an embedded component *
 *********************************************************************************************************************************/

        return BaseController.extend("de.exxcellent.ui5con.Demo.controller.App", {
            onInit() {
                this._attachTargetDisplayHandlers();
            },

            navTo: function (psTarget, pmParameters, pmComponentTargetInfo, pbReplace) {
                //check for pending changes prior to navigating
                this._checkNavigationAllowed()
                    .then((bAllowed) => {
                        if (bAllowed) {
                            BaseController.prototype.navTo.call(this, psTarget, pmParameters, pmComponentTargetInfo, pbReplace);
                        }
                    });
            },

            _attachTargetDisplayHandlers: function () {
                let oTargets = this.getOwnerComponent().getManifestEntry(
                    "/sap.ui5/routing/targets"
                );
                if (!oTargets) {
                    Log.error("No targets were defined in application descriptor");
                    return;
                }

                for (const [sKey, oTarget] of Object.entries(oTargets)) {
                    try {
                        if (oTarget.type === "Component") {
                            this.getRouter().getTarget(sKey).attachEventOnce("display", this._attachComponentNotificationHandlers, this);
                            this.getRouter().getTarget(sKey).attachEvent("display", this._attachComponentNavigationHandler, this);
                        } else {
                            this.getRouter().getTarget(sKey).attachEvent("display", this._attachViewNavigationHandler, this);
                        }
                    } catch (oError) {
                        Log.error(oError.message);
                    }
                }
            },

            _attachComponentNotificationHandlers(oEvent) {
                let oComponentInstance = oEvent
                    .getParameter("object")
                    .getComponentInstance();
                if (oComponentInstance) {
                    try {
                        oComponentInstance.attachNotifyPendingChanges(
                            this._handleComponentNotifyPendingChanges,
                            this
                        );
                    } catch (oError) {
                        Log.error(
                            `Event notifyPendingChanges is not defined in component instance ${oComponentInstance
                                .getMetadata()
                                .getComponentName()}`
                        );
                    }
                }
            },

            /**
            * Registers the component that the app navigated to as the "current" component - enables checking for pending changes from that component
            * @param {*} oEvent the display event of the component route
            */
            _attachComponentNavigationHandler: function (oEvent) {
                let oComponentInstance = oEvent
                    .getParameter("object")
                    .getComponentInstance();
                if (oComponentInstance) {
                    this.getModel("components").setProperty("/currentComponent", oComponentInstance.getId());
                }
            },

            /**
             * Register that there is no "current component" shown in order not to show a false user prompt
             */
            _attachViewNavigationHandler() {
                this.getModel("components").setProperty("/currentComponent", null);
            },

            _handleComponentNotifyPendingChanges(oEvent) {
                this.getOwnerComponent().getModel("components")?.setProperty(
                    `/${oEvent.getSource().getId()}`,
                    {
                        hasPendingChanges: oEvent.getParameter("hasPendingChanges"),
                    }
                );
            },

            _checkNavigationAllowed: function () {
                return new Promise((resolve) => {
                    let sCurrentComponentName = this.getOwnerComponent().getModel("components").getProperty("/currentComponent");
                    if (sCurrentComponentName && this.getOwnerComponent().getModel("components").getProperty(`/${sCurrentComponentName}/hasPendingChanges`)) {
                        MessageBox.confirm("There are unsaved changes. Proceed anyway?", {
                            onClose: (oAction) => {
                                if (oAction === MessageBox.Action.OK) {
                                    // We may, at this point, communicate back to the component to discard its pending changes - omitted in this sample for the sake of brevity
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            }
                        });
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    });