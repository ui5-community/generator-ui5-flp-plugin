sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/dom/includeStylesheet",
	"<%=appURI%>/test/flpSandbox"
], function (Opa5, HashChanger, includeStylesheet, flpSandbox) {
	"use strict";

	/**
	 *  Manually set OPA styles when running test with the FLP Sandbox.
	 *  Function is executed after DOM is available
	 *  */
	function fnSetupFLPStyles() {
		// include standard OPA styles
		includeStylesheet(sap.ui.require.toUrl("sap/ui/test/OpaCss.css"));
	}

	// eslint-disable-next-line no-unused-expressions
	document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fnSetupFLPStyles) : fnSetupFLPStyles();

	return Opa5.extend("<%=appId%>.test.integration.arrangements.Startup", {


		iStartFLP: function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};
			oOptions.autoWait = typeof oOptions.autoWait !== "undefined" ? oOptions.autoWait : true;
			// start the app with a minimal delay to make tests fast but still async to discover basic timing issues
			oOptions.delay = oOptions.delay || 1;

			// configure mock server with the current options
			var aInitializations = [flpSandbox.init()];

			// Wait for all initialization promises of mock server and sandbox to be fulfilled.
			// After that enable the fake LRepConnector
			this.iWaitForPromise(Promise.all(aInitializations));

			this.waitFor({
				autoWait: oOptions.autoWait,
				success: function () {
					new HashChanger().setHash(oOptions.intent + (oOptions.hash ? "&/" + oOptions.hash : ""));
				}
			});
		}
	});
});
