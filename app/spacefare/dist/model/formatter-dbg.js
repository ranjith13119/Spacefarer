sap.ui.define([
	"sap/ui/core/library"
], function (coreLibrary) {
	"use strict";

	const { ValueState } = coreLibrary;

	const Formatter = {
		stardustState : function (sValue) {

			// if the value of fMeasure is not a number, no status will be set
			switch (true) {
				case sValue >= 10000 || sValue == "Expert":
					return ValueState.Success;

				case (sValue >= 7000 && sValue < 10000 ) || sValue == "Advanced":
					return ValueState.Warning;

				case (sValue >= 3000 && sValue < 7000) || sValue == "Intermediate":
					return ValueState.Error;

				default:
					return ValueState.Information;
			}

		}
	};

	return Formatter;
});
