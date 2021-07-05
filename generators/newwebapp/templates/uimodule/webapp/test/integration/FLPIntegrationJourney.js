/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"<%=appURI%>/test/integration/pages/FLPPlugin"
], function (opaTest) {
	"use strict";

	QUnit.module("FLP Integration");

<% if (features.includes("Add a launchpad footer with button")) { %>
	opaTest("Should be able to FLP Shell Footer", function (Given, When, Then) {
		// Arrangements
		Given.iStartFLP({
			intent: "Shell-Home"
		});
		// Assertions
		Then.onTheFLPPage.iShouldSeeFooter();
	});
<% } %>
<% if (features.includes("Add buttons to Me Area")) { %>
	opaTest("Should be able to Help Button", function (Given, When, Then) {
		// Arrangements
		Given.iStartFLP({
			intent: "Shell-Home"
		});
		//Actions
        When.onTheFLPPage.iPressOnAvatar();
		// Assertions
		Then.onTheFLPPage.iShouldSeeHelpPageButton();
	});
<% } %>
});