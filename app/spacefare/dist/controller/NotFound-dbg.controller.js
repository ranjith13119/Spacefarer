sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History"
], (BaseController, History) => {
    "use strict";

    return BaseController.extend("sapp.galactic.spacefare.controller.spacefarer", {
        /**
        * Navigates to the worklist when the link is pressed
        * @public
        */
        onLinkPressed: function () {
            this.getRouter().navTo("Routespacefarer");
        }
    });
});