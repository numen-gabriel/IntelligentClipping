sap.ui.define([
    "sap/m/VBox",
    "sap/ui/core/Control"
  ], function (VBox, Control) {
    "use strict";
  
    return VBox.extend("project1.control.CustomVBox", {
        metadata: {
            properties: {
              url: { type: "string", defaultValue: null }
            },
            events: {
              press: {
                parameters: {
                  url: { type: "string" }
                }
              }
            }
          },
      
          renderer: {},
      
          onAfterRendering: function () {
            if (VBox.prototype.onAfterRendering) {
              VBox.prototype.onAfterRendering.apply(this, arguments);
            }
            this.$().css("cursor", "pointer");
            this.$().on("click", this._handlePress.bind(this));
          },
      
          _handlePress: function (oEvent) {
            this.firePress({ url: this.getUrl() });
          },
      
          exit: function () {
            this.$().off("click", this._handlePress.bind(this));
          }
        });
  });