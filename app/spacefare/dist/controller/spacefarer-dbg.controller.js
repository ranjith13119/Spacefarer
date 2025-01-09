sap.ui.define([
    "./BaseController",
    "sapp/galactic/spacefare/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    "sap/m/MessageToast"
], (BaseController, formatter, Filter, FilterOperator, Fragment, Sorter, MessageToast) => {
    "use strict";

    return BaseController.extend("sapp.galactic.spacefare.controller.spacefarer", {

        formatter: formatter,

        onInit() {
            this.oModel = this.getOwnerComponent().getModel();
            this.oJsonModel = this.getOwnerComponent().getModel("spacefarerModel");
            //  this.getRouter().getRoute("Routespacefarer").attachPatternMatched(this._onObjectMatched, this);
            this.fetchUserScope();
        },

        // Fetch the loggedIn user assigned scope only during the first rendering 

        fetchUserScope: function () {
            const sAppId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            const sAppPath = sAppId.replaceAll(".", "/");
            const sAppModulePath = jQuery.sap.getModulePath(sAppPath);
            $.ajax({
                "url": sAppModulePath + "/user-api/attributes",
                async: false,
                success: jQuery.proxy(function (user) {
                    const { Groups } = user;
                    if (Array.isArray(Groups) && Groups.length && Groups.includes("Admin")) this.oJsonModel.setProperty("/isAdmin", true);
                }).bind(this)
            });
        },

        // _onObjectMatched: async function () {},

        // Handle search operation to filter the spacefarers 
        onSearch: function () {

            var aFilter = [];
            const { selectedSuitColor, spacefarerName, selectedwarmHoleSkill, stardustCollection } = this.oJsonModel.getData();
            // const selectedSuitColor = this.oJsonModel.getProperty("/selectedSuitColor");
            // const spacefarerName = this.oJsonModel.getProperty("/spacefarerName"); 

            if (selectedSuitColor) {
                aFilter.push(
                    new Filter("spacesuitColor/ID", FilterOperator.EQ, selectedSuitColor)
                );
            }
            if (spacefarerName) {
                aFilter.push(
                    new Filter("name", FilterOperator.Contains, spacefarerName)
                );
            }

            if (stardustCollection) {
                aFilter.push(
                    new Filter("stardustCollection", FilterOperator.GE, stardustCollection)
                );
            }
            if (selectedwarmHoleSkill) {
                aFilter.push(
                    new Filter("wormholeNavigationSkill", FilterOperator.EQ, selectedwarmHoleSkill)
                );
            }
            // filterthelistviabinding
            var oList = this.getView().byId("spacefarersTbl");
            var oBinding = oList.getBinding("items");
            aFilter.length ? oBinding.filter(new Filter(aFilter, true)) : oBinding.filter(aFilter);
        },

        // Update Spacefares List count 
        onSpaceFareresLoaded: function (oEvent) {
            const sListTitle = this.getModel('i18n').getResourceBundle().getText('listHeader')
            this.getView().byId('idListTitle').setText(`${sListTitle} (${oEvent.getParameter('total')})`)
        },

        // Open Dialog on Sort Button press  

        onSortButtonPressed: function () {
            //Load and display the sort dialog
            if (!this._oSortDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: 'sapp.galactic.spacefare.view.fragments.SortDialog',
                    controller: this,
                }).then(oDialog => {
                    this._oSortDialog = oDialog
                    this.getView().addDependent(this._oSortDialog)
                    oDialog.open()
                })
            } else {
                this._oSortDialog.open()
            }
        },

        // Open Dialog on Group Button press 

        onGroupButtonPressed: function () {
            //Load and display the group dialog
            if (!this._oGroupDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: 'sapp.galactic.spacefare.view.fragments.GroupDialog',
                    controller: this,
                }).then(oDialog => {
                    this._oGroupDialog = oDialog
                    this.getView().addDependent(this._oGroupDialog)
                    oDialog.open()
                })
            } else {
                this._oGroupDialog.open()
            }
        },

        // Handle Sort action on the server using oData - V2

        onConfirmSort: function (oEvent) {
            // Get sort related event parameters
            const oSortItem = oEvent.getParameter('sortItem')
            const bDescending = oEvent.getParameter('sortDescending')

            // If there is a sort item selected, sort the list binding.
            // Else, sort by empty array to reset any existing sorting.
            this.getView()
                .byId('spacefarersTbl')
                .getBinding('items')
                .sort(oSortItem ? [new Sorter(oSortItem.getKey(), bDescending)] : [])
        },

        // Handle Group action on the server using oData - V2
        onConfirmGroup: function (oEvent) {
            // Get group related event parameters
            const oGroupItem = oEvent.getParameter('groupItem')
            const bDescending = oEvent.getParameter('groupDescending')

            // If there is a group item selected, sort and group the list binding.
            // Else, sort by empty array to reset any existing grouping.
            this.getView()
                .byId('spacefarersTbl')
                .getBinding('items')
                .sort(oGroupItem ? [new Sorter(oGroupItem.getKey(), bDescending, true /* group */)] : [])
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */

        onSpacefarerPress: function (oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject: function (oItem) {
            var oBindingContext = oItem.getBindingContext();
            const { ID } = oBindingContext.getModel().oData[oBindingContext.getPath().replace("/", "")];
            this.getRouter().navTo("details", {
                spacefarerId: ID
            });
        },

        // Open New spacefarer creation dialog 

        onPressAddNewSpacefarer: function () {
            //Load and display the create dialog
            if (!this._oCreateDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: 'sapp.galactic.spacefare.view.fragments.CreateDialog',
                    controller: this,
                }).then(oDialog => {
                    this._oCreateDialog = oDialog
                    this.getView().addDependent(this._oCreateDialog)
                    oDialog.open()
                })
            } else {
                this._oCreateDialog.open()
            }
        },

        // Create new Spacefarer after the validation 

        onPressCreateNewSpacefarer: function () {
            const { newName, newEmail, newPlanet, newDepartment, newWarmHoleSkill, newSpaceSuitColor, newStartDuust } = this.oJsonModel.getData();

            let oPayload = {
                name: newName,
                email: newEmail,
                wormholeNavigationSkill: newWarmHoleSkill,
                originPlanet_ID: newPlanet,
                department_ID: newDepartment,
                spacesuitColor_ID: newSpaceSuitColor,
                stardustCollection: newStartDuust
            }

            // Validate provide spacefarer information 
            if (!this._validate(oPayload)) return

            this.oJsonModel.setProperty("/busy", true);
            const oResourceBundle = this.getModel("i18n").getResourceBundle();

            oPayload.position_ID = "1c21e3b8-7590-40b0-b450-991d3b3c348f"; // Maintain static department 

            // Send create request
            this.getView().getModel().create("/Spacefarers", oPayload, {
                success: (oData, oResponse) => {
                    MessageToast.show(oResourceBundle.getText("createSuccessMsg"));
                    this.oJsonModel.setProperty("/busy", false);
                    this.onPressCancelNewSpacefarer();
                },
                error: oError => {
                    console.log(oError)
                    MessageToast.show(oResourceBundle.getText("createFailMsg"));
                    this.oJsonModel.setProperty("/busy", false);
                    this.onPressCancelNewSpacefarer();
                }
            })
        },

        // Validate Mandatory Spacefarer creation information 

        _validate: function (...aPayload) {

            let oPayload = aPayload[0];
            // Check mandatory inputs
            this.oJsonModel.setProperty("/nameValidState", !!oPayload.name)
            this.oJsonModel.setProperty("/emailValidState", !!oPayload.email)
            this.oJsonModel.setProperty("/newWarmHoleSkillState", !!oPayload.wormholeNavigationSkill)
            this.oJsonModel.setProperty("/planetValueState", !!oPayload.originPlanet_ID)
            this.oJsonModel.setProperty("/departmentValueState", !!oPayload.department_ID)
            this.oJsonModel.setProperty("/newSpaceSuitColorState", !!oPayload.spacesuitColor_ID)
            this.oJsonModel.setProperty("/newStartDuustState", !!oPayload.stardustCollection)

            // Return validation status
            return (!!oPayload.name && !!oPayload.email && !!oPayload.wormholeNavigationSkill && !!oPayload.originPlanet_ID && !!oPayload.department_ID && !!oPayload.spacesuitColor_ID && !!oPayload.stardustCollection);
        },

        // Clost the New spacefarer dialog

        onPressCancelNewSpacefarer: function () {
            this._oCreateDialog.close()
        }
    });
});