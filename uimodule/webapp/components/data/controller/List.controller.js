sap.ui.define([
    "de/exxcellent/ui5con/Data/controller/BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("de.exxcellent.ui5con.Data.controller.List", {
            onInit: function () {
                // Showcase of using the component's different operating modes (varying the data to be displayed). We could also introduce some differences in the views via bindings
                this.byId("dataList").bindElement({
                    path: `/${this.getOwnerComponent().getModel("mode").getProperty("/mode")}`
                });
             },

            onListItemSelected(oSelectedItem) {
                this.getModel().updateBindings(true);
                this.navTo("edit", { id: encodeURIComponent(oSelectedItem?.getBindingContext()?.getPath()) });
            }
        });
    }
);