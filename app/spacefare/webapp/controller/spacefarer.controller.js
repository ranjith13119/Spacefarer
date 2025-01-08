sap.ui.define([
    "./BaseController",
    "sapp/galactic/spacefare/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter'
], (BaseController, formatter, Filter, FilterOperator, Fragment, Sorter) => {
    "use strict";

    return BaseController.extend("sapp.galactic.spacefare.controller.spacefarer", {

        formatter: formatter,

        onInit() {
            this.oModel = this.getOwnerComponent().getModel();
            this.oJsonModel = this.getOwnerComponent().getModel("spacefarerModel");
            //  this.getRouter().getRoute("Routespacefarer").attachPatternMatched(this._onObjectMatched, this);
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

            if(stardustCollection) { 
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

        onSpaceFareresLoaded: function (oEvent) {
            const sListTitle = this.getModel('i18n').getResourceBundle().getText('listHeader')
            this.getView().byId('idListTitle').setText(`${sListTitle} (${oEvent.getParameter('total')})`)
        },
        onSortButtonPressed() {
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

        onGroupButtonPressed() {
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

        // Handle confirm sort
        onConfirmSort(oEvent) {
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

        // Handle confirm group
        onConfirmGroup(oEvent) {
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

        onSpacefarerPress: function(oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject : function (oItem) {
            var oBindingContext = oItem.getBindingContext();
            const { ID } = oBindingContext.getModel().oData[oBindingContext.getPath().replace("/","")];
            this.getRouter().navTo("details", {
                spacefarerId: ID
            });
        },
    });
});