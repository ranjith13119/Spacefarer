sap.ui.define([
    "sap/ui/core/UIComponent",
    "sapp/galactic/spacefare/model/models",
    "./controller/ErrorHandler",
    "sap/ui/Device",
    "sapp/galactic/spacefare/model/constants"
], (UIComponent, models, ErrorHandler, Device, constants) => {
    "use strict";

    return UIComponent.extend("sapp.galactic.spacefare.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // initialize the error handler with the component
            this._oErrorHandler = new ErrorHandler(this);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            // set the initial data for the JSON Model 
            this.initJsonModel();

        },

        // set the initial data for the JSON Model  
        initJsonModel: function () {
            this.getModel("spacefarerModel").setData(constants);
        },

        /**
                * The component is destroyed by UI5 automatically.
                * In this method, the ErrorHandler is destroyed.
                * @public
                * @override
                */
        destroy: function () {
            this._oErrorHandler.destroy();
            // call the base component's destroy function
            UIComponent.prototype.destroy.apply(this, arguments);
        },

        /**
            * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy. It is checks the content density of the FLP and assign if accordingly
            * design mode class should be set, which influences the size appearance of some controls. 
            * @public
            * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
            */
        getContentDensityClass: function () {
            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                // eslint-disable-next-line sap-no-proprietary-browser-api
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }
    });
});