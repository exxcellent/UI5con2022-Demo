sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(
	Controller,
	JSONModel,
) {
	"use strict";

	return Controller.extend("de.exxcellent.ui5con.Data.embeddable.RequiredApprovalsButton", {
        /**
         * @override
         */
        onInit() {
            this._requiredApprovalsModel = new JSONModel({
                requiredApprovalsCount: 0
            });
            this.getView().setModel(this._requiredApprovalsModel);

            this._updateApprovals();

            sap.ui.getCore().getEventBus().subscribe("data", "approvalChanged", this._updateData, this);
        },

        _updateApprovals() {
            const aBlue = this.getOwnerComponent().getModel().getProperty("/blue");
            const aRed = this.getOwnerComponent().getModel().getProperty("/red");
            const aData = aBlue.concat(aRed);
            if (aData?.length) {
                const iRequiredApprovals = aData.reduce((sum, item) => {
                    if (!item.approved) {
                        sum++;
                    }
                    return sum;
                }, 0);
                this._requiredApprovalsModel.setProperty("/requiredApprovalsCount", iRequiredApprovals);
            }
        },

        _updateData(channel, event, payload) {
            // I'm cheating a bit here: since this sample doesn't use any persistent storage from where the component could load its data and write updates to,
            // other instances of this component will not have their data updated.
            // So I'm using the global EventBus to not only notify potential other instances about updated data being available, but to also send the updated data with it
            if (payload && payload.path && payload.data) {
                this.getOwnerComponent().getModel().setProperty(payload.path, payload.data);
                this._updateApprovals();
            }
        }
	});
});