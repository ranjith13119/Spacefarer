sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History",
  "../model/formatter"
], (BaseController, JSONModel, History, formatter) => {
  "use strict";

  return BaseController.extend("sapp.galactic.spacefare.controller.Details", {

    formatter: formatter,

    /**
         * Called when the worklist controller is instantiated.
         * @public
         */

    onInit() {
        this.oModel = this.getOwnerComponent().getModel();
        this.oJsonModel = this.getOwnerComponent().getModel("spacefarerModel");
        this.getRouter().getRoute("details").attachPatternMatched(this._onObjectMatched, this);
    }, 

      /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */

    _onObjectMatched : function (oEvent) {
      var spacefarerId =  oEvent.getParameter("arguments").spacefarerId;
      this._bindView("/Spacefarers/" + spacefarerId);
  },
  /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
  _bindView : function (sObjectPath) {

    this.getView().bindElement({
        path: sObjectPath,
        parameters: {
            expand: "originPlanet,spacesuitColor,department,position,species"
        },
        events: {
            change: this._onBindingChange.bind(this),
            dataRequested: function () {
              this.oJsonModel.setProperty("/busy", true);
            }.bind(this),
            dataReceived: function () {
              this.oJsonModel.setProperty("/busy", false);
            }.bind(this)
        }
    });
},
_onBindingChange : function () {
  var oView = this.getView(),
      oViewModel = this.getModel("objectView"),
      oElementBinding = oView.getElementBinding();

  // No data for the binding
  if (!oElementBinding.getBoundContext()) {
      this.getRouter().getTargets().display("detailsNotFound");
      return;
  }

  var oResourceBundle = this.getResourceBundle(),
      oObject = oView.getBindingContext().getObject(),
      sObjectId = oObject.ProductName,
      sObjectName = oObject.Products;

      this.oJsonModel.setProperty("/busy", false);
      this.oJsonModel.setProperty("/shareSendEmailSubject",
          oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
          this.oJsonModel.setProperty("/shareSendEmailMessage",
          oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
}
  });
});