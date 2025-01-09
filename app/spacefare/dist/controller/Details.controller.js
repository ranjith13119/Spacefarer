sap.ui.define(["./BaseController","../model/formatter","sap/ui/core/Fragment","sap/m/MessageBox","sap/m/MessageToast"],(e,t,o,s,i)=>{"use strict";return e.extend("sapp.galactic.spacefare.controller.Details",{formatter:t,onInit(){this.oModel=this.getOwnerComponent().getModel();this.oJsonModel=this.getOwnerComponent().getModel("spacefarerModel");this.getRouter().getRoute("details").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){this.spacefarerId=e.getParameter("arguments").spacefarerId;this._bindView("/Spacefarers/"+this.spacefarerId)},_bindView:function(e){this.getView().bindElement({path:e,parameters:{expand:"originPlanet,spacesuitColor,department,position,species"},events:{change:this._onBindingChange.bind(this),dataRequested:function(){this.oJsonModel.setProperty("/busy",true)}.bind(this),dataReceived:function(){this.oJsonModel.setProperty("/busy",false)}.bind(this)}})},_onBindingChange:function(){var e=this.getView(),t=e.getElementBinding();if(!t.getBoundContext()){this.getRouter().getTargets().display("detailsNotFound");return}this.oJsonModel.setProperty("/busy",false)},onEditPress:function(){this.oJsonModel.setProperty("/handleEditControl",true);this.oJsonModel.setProperty("/updatedColor","");this.oJsonModel.setProperty("/updateStarDustValue","");if(!this._oEditDialog){o.load({id:this.getView().getId(),name:"sapp.galactic.spacefare.view.fragments.EditDialog",controller:this}).then(e=>{this._oEditDialog=e;this.getView().addDependent(this._oEditDialog);e.open()})}else{this._oEditDialog.open()}},onPressCancelEditSpace:function(){this.oJsonModel.setProperty("/handleEditControl",false);this._oEditDialog.close()},onPressUpdateSpace:function(){const e=this.oJsonModel.getProperty("/updatedColor");const t=this.oJsonModel.getProperty("/updateStarDustValue");const o={spacesuitColor_ID:e,stardustCollection:t};this.oJsonModel.setProperty("/busy",true);const i=this.getModel("i18n").getResourceBundle();this.oModel.update("/Spacefarers/"+this.spacefarerId,o,{success:e=>{s.information(i.getText("updateSuccMsg"));this._oEditDialog.close();this.oJsonModel.setProperty("/busy",false);this.oJsonModel.setProperty("/handleEditControl",false)},error:()=>{s.error(i.getText("updateFailMsg"));this._oEditDialog.close();this.oJsonModel.setProperty("/busy",false);this.oJsonModel.setProperty("/handleEditControl",false)}})},onPressDelete:function(){this.oJsonModel.setProperty("/busy",true);const e=this.getModel("i18n").getResourceBundle();this.oModel.remove("/Spacefarers/"+this.spacefarerId,{success:()=>{i.show(e.getText("deleteSuccessMsg"));this.oJsonModel.setProperty("/busy",false);this.onPressBack()},error:()=>{s.error(e.getText("deleteFailMsg"));this.oJsonModel.setProperty("/busy",false)}})},onPressBack:function(){this.getRouter().navTo("Routespacefarer")}})});
//# sourceMappingURL=Details.controller.js.map