sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
	"sap/m/Image",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/VBox",
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "../utils/formatter"
], function(Controller, DateFormat, Image, Text, Button, VBox, jQuery, Fragment, MessageBox,formatter) {
    "use strict";

    return Controller.extend("project1.controller.View1", {

        formatter: formatter,

        onInit: function() {
            // Obtenha a referência à sua view
            var oView = this.getView();

            // Armazene a referência ao fragmento para que possa ser acessado posteriormente
            this.oBoxNewsFragment = sap.ui.xmlfragment(oView.getId(), "project1.view.BoxNews", this);

        },

        formatDate: function(sDate) {
            var oDateFormat = DateFormat.getDateInstance({
                pattern: "dd MMM, yyyy"
            });
            return oDateFormat.format(new Date(sDate));
        },

        onTabSelect: function(oEvent){
            this.setSelectedKey(oEvent);            
        },

        setSelectedKey: function(oEvent){
            this.byId("tabAll").getCustomData()[1].setValue("False");
            this.byId("tabPrice").getCustomData()[1].setValue("False");
            this.byId("tabAval").getCustomData()[1].setValue("False");
            this.byId("tabEsg").getCustomData()[1].setValue("False");

            oEvent.getSource().getCustomData()[1].setValue("True");

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

        openFragment: function() {
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("project1.view.Popover", this);
                this.getView().addDependent(this._oPopover);
            }
            this._oPopover.openBy(this.getView().byId("BT1"));
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
                oObjectHeader.setText(sNewTitle);
            }
        },

        adicionaNews: function(sTitle,sText,sUrl,sDate,sSource,sAuthor,sSourceCountry,sImage){
                        
            var oModel = this.getView().getModel("news");
            var oData = oModel.getData();
        
            const url = new URL(sSource);
            const baseUrl = `${url.hostname}`;

            var oGridListItem = this.getView().byId("gridListItemId");
            var sGridRow = "";
            var sGridColumn = "";
            var sVboxClass = "";
            var sImgClass = "";
            // oGridListItem.removeStyleClass("layout-5-columns");
            // oGridListItem.removeStyleClass("layout-10-columns");
            
            if(oModel.getProperty("/news").length !== 0) {
                // oGridListItem.addStyleClass("layout-5-columns");
                sImgClass  = "img";
                sVboxClass = "demoBox";
            } else {
                sGridRow = "1 / 3";
                sGridColumn = "1 / 3";
                sImgClass  = "imgMain";
                sVboxClass = "VBox";                
            }

            var sTarget = 50;
            var sLow = "False";
            var sMedium = "False";
            var sHigh= "False";
            if( sTarget <= 33.33 ){
                sLow = "True";
                sTarget = sTarget;
            }
            if( sTarget > 33.33 && sTarget <= 66.66 ){
                sMedium = "True";
                sTarget = sTarget - 34
            }
            if( sTarget > 66.66 ){
                sHigh = "True";
                sTarget = sTarget - 67;
            }                        


            oData.news.push({
                Count: oModel.getProperty("/news").length,
                GridRow: sGridRow,
                GridColumn: sGridColumn,
                VboxClass: sVboxClass,
                ImgClass: sImgClass,
                title: sTitle,
                text: sText,
                url: sUrl,
                date: sDate,
                source: baseUrl,
                author: sAuthor,
                source_country: sSourceCountry,
                image: sImage,
                TargetValue: sTarget,
                Low: sLow,   
                Medium: sMedium,
                High: sHigh,
                price: 'High',
                esg: 'High',
                availability: 'High',
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
                this.loadClipping();
            }
        },

        calcTarget: function(oValue){
            var sTotal = 300;
            var sUnitBar = 100;
        },

        loadClipping: function() {
            
            // var oObjectHeader = this.byId("TTL1");
            
            var oMaterial = this.byId("vm").getSelectedKey();

            this.byId("idPage").setBusy(true);
            
            // var sObjectHeaderTitle = oObjectHeader.getText();
            var sObjectHeaderTitle = oMaterial;

            console.log("TTL1: ", sObjectHeaderTitle);
            
            // this.getView().byId("section1").setVisible(true);

            const oData = this.getView().getModel().getData();
            const fromDate = oData.from;
            const toDate = oData.to;
            const formattedFromDate = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy"
            }).format(fromDate);
            const formattedToDate = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy"
            }).format(toDate);
            console.log("variavel nova: ", formattedFromDate);

            /*
            var data = this.getView().getModel().getData();
            console.log("var data: ", data);
            */
            const partesFromData = formattedFromDate.split('/');
            const partesToData = formattedToDate.split('/');
            console.log("var partesFromData: ", partesFromData);
            const dataFromFormatada = `${partesFromData[2]}-${partesFromData[1]}-${partesFromData[0]}`;
            const dataToFormatada = `${partesToData[2]}-${partesToData[1]}-${partesToData[0]}`;
            console.log("var dataFormatada: ", dataFromFormatada);
            

              var meusDados = "41f32810c57c4cc1b78e9d792c813d09";
              
              const params = new URLSearchParams({
                'text': sObjectHeaderTitle,                              
                'earliest-publish-date': dataFromFormatada,
                'latest-publish-date': dataToFormatada,
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

        onImageError: function(oEvent){
            // var sText = oImage.getCustomData()[1].getValue();            
            var oImage = oEvent.getSource();
            var sText = oImage.getCustomData()[1].getValue();
            var iWidth = oImage.getWidth();
            var iHeight = oImage.getHeight();

            var pathImgText = oEvent.getSource().getBindingInfo("src").binding.getContext().sPath + "/text";
            var pathImgTitle = oEvent.getSource().getBindingInfo("src").binding.getContext().sPath + "/title";
            var text = this.getView().getModel("news").getProperty(pathImgText);
            this.getView().getModel("news").setProperty(pathImgTitle,text);

            var sSvgImage = this._generateSvgImage(sText, iWidth, iHeight);

            oImage.setSrc(sSvgImage);

        },

        _generateSvgImage: function (sText, iWidth, iHeight) {
            var sSvgTemplate =
                `<svg width="${iWidth}" height="${iHeight}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white" />
                    <foreignObject x="10" y="10" width="180" height="180">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 3vw; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: left; word-wrap: break-word;">
                            ${sText}
                        </div>
                    </foreignObject>
                </svg>`;

            // Parse the SVG template to ensure proper encoding
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(sSvgTemplate, "image/svg+xml");
            var serializer = new XMLSerializer();
            var sSvgSerialized = serializer.serializeToString(xmlDoc);

            return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(sSvgSerialized)));
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

            this.byId("noDataBox").setVisible(false);
            
            //oModel.setData(data.news);
            oModel.setData({ news: [] }); // Limpa a lista de notícias existente
            
            data.news.forEach(element => {
                this.adicionaNews( element.title, element.text,element.url,element.publish_date,element.url,element.author,element.source_country,element.image);
            });
            
            this.byId("idPage").setBusy(false);
            //var oModel = this.getView().getModel("news");
            //var dataNews = oModel.getData();
            var dataNews = oModel.getData().news;
            if( dataNews.length === 0){
                MessageBox.information("News not found");
                this.byId("noDataBox").setVisible(true);
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

        onClickNews: function(oEvent) {
            var sUrl = oEvent.getParameter("url");
            sap.m.URLHelper.redirect(sUrl, true);
        }

    });
});