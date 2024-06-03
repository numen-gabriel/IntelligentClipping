sap.ui.define(function() {
	"use strict";

	var Formatter = {

        ImagePath: function(sImage){
            return jQuery.sap.getModulePath("project1") + "/assets/" + sImage;
        },

		relevance :  function (sRelevance) {
				if (sRelevance === "High") {
					return "Success";
				} else if (sRelevance === "Medium") {
					return "Warning";
				} else if (sRelevance === "Low"){
					return "Error";
				} else {
					return "None";
				}
		},

        avalImpact :  function (sAvalImpact) {
            if (sAvalImpact === "Low") {
                return "Success";
            } else if (sAvalImpact === "Medium") {
                return "Warning";
            } else if (sAvalImpact === "High"){
                return "Error";
            } else {
                return "None";
            }
        },

        esgImpact :  function (sEsgImpact) {
            if (sEsgImpact === "Low") {
                return "Success";
            } else if (sEsgImpact === "Medium") {
                return "Warning";
            } else if (sEsgImpact === "High"){
                return "Error";
            } else {
                return "None";
            }
        },        

		priceImpact :  function (sPriceImpact) {
            if (sPriceImpact === "Decrease") {
                return "Success";
            } else if (sPriceImpact === "Neutral") {
                return "None";
            } else if (sPriceImpact === "Increase"){
                return "Error";
            } else {
                return "None";
            }
    }        
	};

	return Formatter;

},  /* bExport= */ true);