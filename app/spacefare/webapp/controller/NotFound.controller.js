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
        onNavBack: function () {
            const oHistory = History.getInstance()
            const sPreviousHash = oHistory.getPreviousHash()
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this)

            // If there is a previous hash, navigate to it. Else, navigate to the home page.
            if (sPreviousHash !== undefined) {
                window.history.go(-1)
            } else {
                oRouter.navTo('Routespacefarer', {}, true /* no history */)
            }
        }
    });
});