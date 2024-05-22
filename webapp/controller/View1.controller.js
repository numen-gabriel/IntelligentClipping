sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/m/Image",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/VBox",
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function(Controller, Image, Text, Button, VBox, jQuery, Fragment, MessageBox) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function() {
            // Obtenha a referência à sua view
            var oView = this.getView();

            // Armazene a referência ao fragmento para que possa ser acessado posteriormente
            this.oBoxNewsFragment = sap.ui.xmlfragment(oView.getId(), "project1.view.BoxNews", this);

        },

        onOpenLink: function(oEvent){
            var sUrl = oEvent.getSource().getCustomData()[0].getValue(); 
            window.open(sUrl,"_blank");              
          },

        _getResponsivePopover: function () {
			if (!this._oPopoverPromise) {
				this._oPopoverPromise = Fragment.load({
					id: this.getView().getId(),
					name: "project1.view.Popover",
					controller: this
				}).then(function (oPopover) {
					this.getView().addDependent(oPopover);
					return oPopover;
				}.bind(this));
			}
			return this._oPopoverPromise;
		},

        handleTitleSelectorPress: function(oEvent){
            this._getResponsivePopover().then(function (oPopOver) {
				oPopOver.openBy(oEvent.getParameter("domRef"));
				oPopOver.setModel(oEvent.getSource().getModel());
			});
        },

        handleItemSelect: function(oEvent){
            // Obtenha o item selecionado diretamente do evento
            var oSelectedItem = oEvent.getParameter("listItem");

            // Verifique se um item foi selecionado
            if (oSelectedItem) {
                // Obtenha o texto do item selecionado
                var sNewTitle = oSelectedItem.getTitle();
                console.log("sNewTitle :", sNewTitle);

                // Obtenha uma referência ao ObjectHeader TTL1
                var oObjectHeader = this.byId("TTL1");

                // Atualize o objectTitle com o novo título
                oObjectHeader.setObjectTitle(sNewTitle);
            }
        },

        adicionaNews: function(sTitle,sText,sUrl,sDate,sSource,sAuthor,sSourceCountry,sImage){
            
            var oModel = this.getView().getModel("news");
            var oData = oModel.getData();
        
            const url = new URL(sSource);
            const baseUrl = `${url.hostname}`;

            var oGridListItem = this.getView().byId("gridListItemId");

            oGridListItem.removeStyleClass("layout-5-columns");
            oGridListItem.removeStyleClass("layout-10-columns");
            
            if(oModel.getProperty("/news").length !== 0) {
                oGridListItem.addStyleClass("layout-5-columns");

            } else {
                oGridListItem.addStyleClass("layout-10-columns");

            }

            oData.news.push({
                title: sTitle,
                text: sText,
                url: sUrl,
                date: sDate,
                source: baseUrl,
                author: sAuthor,
                source_country: sSourceCountry,
                image: sImage
              });
            
            oModel.setData(oData);
            
        },

        validateField: function(oEvent) {
            var oInput = oEvent.getSource();
            if (!oInput.getValue()) {
                oInput.setValueState(sap.ui.core.ValueState.Error);
                oInput.setValueStateText("Required field");
            } else {
                oInput.setValueState(sap.ui.core.ValueState.None);
            }
        },

        loadClipping: function() {

            var oObjectHeader = this.byId("TTL1");
            
            var sObjectHeaderTitle = oObjectHeader.getObjectTitle();

            console.log("TTL1: ", sObjectHeaderTitle);
            
            this.getView().byId("section1").setVisible(true);
            var data = this.getView().getModel().getData();
            console.log("var data: ", data);
            const partesData = data.from.split('/');
            console.log("var partesData: ", partesData);
            const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
            console.log("var dataFormatada: ", dataFormatada);

              var meusDados = "35688e4e32d44002beeec326abee2973";
              
              const params = new URLSearchParams({
                'text': sObjectHeaderTitle,
                'language': 'en',                                
                'earliest-publish-date': dataFormatada,
                'sort': 'publish-time',
                'sort-direction': 'DESC',
                'number': 10
              });              
              
              console.log("Flag 1");

              const queryString = params.toString();
              const url = this.getBaseURL() + `/search-news?${queryString}`;
              
              console.log("url ", url);

              fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': meusDados
                },
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('A resposta da rede não foi ok.');
                }
                return response.json();
              })
              .then(dataResponse => this.dataNews(dataResponse))
              .catch(error => console.error("Erro ao chamar a API:", error));
        },

        getBaseURL: function () {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            return appModulePath;
          },

        dataNews: function(data){              
            //var oModel = new sap.ui.model.json.JSONModel();
            var oModel = this.getView().getModel("news");
            
            //oModel.setData(data.news);
            oModel.setData({ news: [] }); // Limpa a lista de notícias existente
            
            data.news.forEach(element => {
                this.adicionaNews( element.title, element.text,element.url,element.publish_date,element.url,element.author,element.source_country,element.image);
            });
            
            //var oModel = this.getView().getModel("news");
            //var dataNews = oModel.getData();
            var dataNews = oModel.getData().news;
            if( dataNews.length === 0){
                MessageBox.information("News not found");
                return;
            }
            console.log("dataNews: ", dataNews);
                        
            this.byId("grid1").getBinding("items").refresh();
        },

        ExibicaoFragment: function(){
            var oVBox = this.getView().byId("idVBoxNews");
            oVBox.addItem(this.oBoxNewsFragment);

            
        },

        loadTilesFromDB: function(data) {
            
            var oTilesContainer = this.getView().byId("tilesContainer");

            try {
                
                data.news.forEach(function(oItem) {
                    var oGenericTile = new VBox({
                    });
                    var oImage = new Image({
                        src: oItem.image
                    });
                    var oTitle = new Text({
                        text: oItem.title

                    });
                    var oAuthor = new Text({
                        text: oItem.author
                    });
                    
                    oGenericTile.addItem(oImage);
                    oGenericTile.addItem(oTitle);
                    oGenericTile.addItem(oAuthor);

                    oTilesContainer.addItem(oGenericTile);
                }.bind(this));
            } 
            catch (error) 
            {
                console.error("Erro ao processar os dados:", error.message);
            }
        },

        teste: function() {
            console.log("clicou")
        }

    });
});