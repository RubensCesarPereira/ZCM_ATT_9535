sap.ui.define([
	"jquery.sap.global",
	'sap/m/MessageBox',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/ui/model/Filter'
], function(jQuery, MessageBox, Fragment, Controller, JSONModel, MessageToast, Filter) {
	"use strict";

	return Controller.extend("HCM_ATT_9535.controller.View1", {
		onInit: function(evt) {

		},
		handleValueHelp: function(oEvent) {
			var sServiceUrl = "/sap/opu/odata/sap/ZHCM_ANEXA_ATESTADO_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);

			var oJsonModel = new sap.ui.model.json.JSONModel();
			var oGlobalBusyDialog = new sap.m.BusyDialog(); //PREPARA UM LOAD NA TELA
			oModel.read("/buscaCidSet?", null, null, true, function(oData, response) {
				oGlobalBusyDialog.close(); //FECHA O LOAD
				oJsonModel.setData(oData);
			});

			sap.ui.getCore().setModel(oJsonModel);
			this.getView().setModel(oJsonModel);

			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// cria o value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"HCM_ATT_9535.view.Dialog",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// abre o value help dialog filtrando pelo input value
			this._valueHelpDialog.open(sInputValue);
			oGlobalBusyDialog.open(); //ABRE O LOAD
		},
		_handleValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var FilterPernr = new sap.ui.model.Filter("DiagnMc", sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([FilterPernr]);
		},
		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
				//var productInput2 = this.byId("application-ZANEXA_ATT9535-display-component---View1--dialogDes");
				//productInput2.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		Update: function() { //METODO O UPDATE DO ASO
			var sServiceUrl = "/sap/opu/odata/sap/ZHCM_ANEXA_ATESTADO_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);

			MessageBox.confirm(
				"Deseja salvar?", {
					onClose: function(sButton) {
						if (sButton === MessageBox.Action.OK) {

							var oEntry = {}; //SETA AS CHAVES NO ARRAY PRO UPDATE

							var wi_id_array = window.location.href.split("ZANEXA_ATT9535-display?");
							var wi_id = wi_id_array[1];
							oEntry.Wid = wi_id;
							oEntry.Znome = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--znome").getValue();
							oEntry.Zcrm = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--zcrm").getValue();
							oEntry.Zcid = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--dialogExame").getValue();
							oEntry.IssuerName = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_name").getValue();
							oEntry.IssuerNumber = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_number").getValue();
							oEntry.IssuerState = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_state").getSelectedKey();
							oEntry.AssigneeCnpj = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--assignee_cnpj").getValue();
							oEntry.IssuerOcId = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_oc_id").getSelectedKey();

							//	var campos = sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app").getController().onValidaCampos();
							//	if (campos === 0) {

							var oGlobalBusyDialog = new sap.m.BusyDialog(); //PREPARA UM LOAD NA TELA
							oGlobalBusyDialog.open();
							oModel.update("/medicoSet(Wid='" + oEntry.Wid + "')", oEntry, null,
								function(oData) {
									oGlobalBusyDialog.close(); //FECHA O LOAD
									MessageBox.information(
										"Dados salvos com sucesso!", {
											onClose: function(sButton2) {
												window.close();
											}
										}
									);
								},
								function(err) { //DA UM GET NO ERRO
									oGlobalBusyDialog.close(); //FECHA O LOAD
									var errorObj1 = jQuery.parseXML(err.response.body).querySelector("message");
									sap.m.MessageBox.show(
										errorObj1.textContent,
										sap.m.MessageBox.Icon.ERROR,
										"Erro ao atualizar o registro"
									);
								});
							//	} else {
							//		sap.m.MessageBox.show(
							//			"Por favor preencha todos os campos obrigatórios",
							//			sap.m.MessageBox.Icon.ERROR,
							//			"Erro ao atualizar o registro"
							//		);
							//	}
						}
					}
				}
			);
		},
		onValidaCampos: function() {
			var retorno = 0;
			if (sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--znome").getValue() === "") {
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--znome").setValueStateText("Campo obrigatório");
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--znome").setValueState("Error");
				retorno = 1;
			}
			if (sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--zcrm").getValue() === "") {
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--zcrm").setValueStateText("Campo obrigatório");
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--zcrm").setValueState("Error");
				retorno = 1;
			}
			if (sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--dialogExame").getValue() === "") {
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--dialogExame").setValueStateText("Campo obrigatório");
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--dialogExame").setValueState("Error");
				retorno = 1;
			}
			if (sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_state").getSelectedKey() === "") {
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_state").setValueStateText("Campo obrigatório");
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_state").setValueState("Error");
				retorno = 1;
			}
			if (sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_oc_id").getSelectedKey() === "") {
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_oc_id").setValueStateText("Campo obrigatório");
				sap.ui.getCore().byId("application-ZANEXA_ATT9535-display-component---app--issuer_oc_id").setValueState("Error");
				retorno = 1;
			}
			return retorno;
		}
	});
});