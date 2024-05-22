/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "project1/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("project1.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                var oModel = new JSONModel({
                    from: "",  // Propriedades adicionais podem ser adicionadas conforme necessário
                    ProductCollection: [  // Exemplo de uma coleção de produtos
                        { text: "Cacau" },
                        { text: "Petróleo" },
                        { text: "Trigo" },
                        { text: "Brazil" }
                        // Adicione mais itens conforme necessário
                    ]
                });   
                this.setModel(oModel); 

                var FirstNewsModel = new JSONModel({
                    news : []
                });
                this.setModel(FirstNewsModel,"firstNews");
                
                var newsModel = new JSONModel({
                    news : []
                });
                this.setModel(newsModel,"news");

                var genAi = new JSONModel({
                    Analysis: []
                });
                this.setModel(genAi,"genAi");
            }
        });
    }
);