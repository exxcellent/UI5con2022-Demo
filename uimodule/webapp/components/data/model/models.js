sap.ui.define(
    ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     *
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     *
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        const MODE = {
            BLUE: "blue",
            RED: "red"
        };

        return {
            createDeviceModel: function () {
                const oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createModeModel: function (sMode) {
                const mode = sMode === MODE.RED ? MODE.RED : MODE.BLUE;
                const oModel = new JSONModel({
                    mode: mode
                });
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
        };
    }
);
