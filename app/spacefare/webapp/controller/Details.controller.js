sap.ui.define([
    "./BaseController",
    "../model/formatter",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (BaseController, formatter, Fragment, MessageBox, MessageToast) => {
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

        _onObjectMatched: function (oEvent) {
            this.spacefarerId = oEvent.getParameter("arguments").spacefarerId;
            this._bindView("/Spacefarers/" + this.spacefarerId);
        },
        /**
               * Binds the view to the object path.
               * @function
               * @param {string} sObjectPath path to the object to be bound
               * @private
               */
        _bindView: function (sObjectPath) {

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

        _onBindingChange: function () {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("detailsNotFound");
                return;
            }
            this.oJsonModel.setProperty("/busy", false);
        },

        // Open Edit Dialog to update the spacefarer information 

        onEditPress: function () {
            this.oJsonModel.setProperty("/handleEditControl", true);
            this.oJsonModel.setProperty("/updatedColor", "");
            this.oJsonModel.setProperty("/updateStarDustValue", "");
            if (!this._oEditDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: 'sapp.galactic.spacefare.view.fragments.EditDialog',
                    controller: this,
                }).then(oDialog => {
                    this._oEditDialog = oDialog
                    this.getView().addDependent(this._oEditDialog)
                    oDialog.open()
                })
            } else {
                this._oEditDialog.open()
            }
        },

         // Cancel the spacefarer edit action 
        onPressCancelEditSpace: function () {
            this.oJsonModel.setProperty("/handleEditControl", false);
            this._oEditDialog.close()
        },

        // update the spacefarer information 
        onPressUpdateSpace: function () {
            const updatedColor = this.oJsonModel.getProperty("/updatedColor");
            const updateStarDustValue = this.oJsonModel.getProperty("/updateStarDustValue");

            const oPayload = {
                spacesuitColor_ID: updatedColor,
                stardustCollection: updateStarDustValue
            }
            this.oJsonModel.setProperty("/busy", true);
            const oResourceBundle = this.getModel("i18n").getResourceBundle()
            this.oModel.update("/Spacefarers/" + this.spacefarerId, oPayload, {
                success: oData => {
                    MessageBox.information(oResourceBundle.getText("updateSuccMsg"))
                    this._oEditDialog.close()
                    this.oJsonModel.setProperty("/busy", false);
                    this.oJsonModel.setProperty("/handleEditControl", false);
                },
                error: () => {
                    MessageBox.error(oResourceBundle.getText("updateFailMsg"))
                    this._oEditDialog.close()
                    this.oJsonModel.setProperty("/busy", false);
                    this.oJsonModel.setProperty("/handleEditControl", false);
                }
            })
        },

        // Delete the spacefarer information as an admin 

        onPressDelete: function () {

            this.oJsonModel.setProperty("/busy", true);
            const oResourceBundle = this.getModel("i18n").getResourceBundle();
            // Send delete request
            this.oModel.remove("/Spacefarers/" + this.spacefarerId, {
                success: () => {
                    MessageToast.show(oResourceBundle.getText("deleteSuccessMsg"));
                    this.oJsonModel.setProperty("/busy", false);
                    this.onPressBack();
                },
                error: () => {
                    MessageBox.error(oResourceBundle.getText("deleteFailMsg"));
                    this.oJsonModel.setProperty("/busy", false);
                },
            })
        },
        
        onPressBack: function () {
            this.getRouter().navTo("Routespacefarer");
        }
    });
});