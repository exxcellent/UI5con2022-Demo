/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require(["de/exxcellent/ui5con/Demo/test/integration/AllJourneys"], function () {
        QUnit.start();
    });
});
