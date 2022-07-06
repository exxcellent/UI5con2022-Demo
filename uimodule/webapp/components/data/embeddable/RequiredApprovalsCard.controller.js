sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/base/strings/formatMessage"
], function(
	Controller, JSONModel, formatMessage
) {
	"use strict";

	return Controller.extend("de.exxcellent.ui5con.Data.embeddable.RequiredApprovalsCard", {
		/**
		 * @override
		 */
		onInit() {
			this._requiredApprovalsModel = new JSONModel({
                requiredApprovalsCount: 0
            });
            this.getView().setModel(this._requiredApprovalsModel);

            this._updateData();

            sap.ui.getCore().getEventBus().subscribe("data", "approvalChanged", this._updateData, this);
		},

		formatRequiredApprovalsHeaderCount(sI18nKey, iShownItems, iTotalItems) {
			return formatMessage(sI18nKey, iShownItems.length, iTotalItems);
		},

        onListItemSelected(oSelectedItem) {
            // get rid of the selection in the list right away so it could be selected again
            this.byId("dataList").removeSelections(true);
            // here, we unfortunately have to include quite some knowledge about the route and target names of the embedding component
            const sName = oSelectedItem?.getBindingContext()?.getProperty("name");
            const sRoute = sName.includes("Red") ? "red" : "blue";
            const sComponentTarget = sName.includes("Red") ? "ComponentRed" : "ComponentBlue";
            const oComponentTargetInfo = {};
            oComponentTargetInfo[sComponentTarget] = {
                route: "edit",
                parameters: {
                    id: encodeURIComponent(oSelectedItem?.getBindingContext()?.getProperty("path"))
                }
            }

            this.getOwnerComponent().fireRequestNavigate({
                route: sRoute,
                componentTargetInfo: oComponentTargetInfo
            })
        },

		_updateApprovals() {
            const aData = this._collateData();
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
            }
            const aData = this._collateData();
			this.getView().getModel().setProperty("/dataItems", aData.slice(0, 5));
			this._updateApprovals();
        },

        _collateData() {
            const aBlue = this.getOwnerComponent().getModel().getProperty("/blue");
            const aRed = this.getOwnerComponent().getModel().getProperty("/red");

            // Manually supply the binding path to each element - not great but it helps keeping this sample somewhat simple
            aBlue.forEach(item => item.path = `/blue/${aBlue.indexOf(item)}`);
            aRed.forEach(item => item.path = `/red/${aRed.indexOf(item)}`);

            return aBlue.concat(aRed).filter(item => !item.approved);
        }
	});
});