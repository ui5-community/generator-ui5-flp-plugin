sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/actions/Press"
], function (Opa5, PropertyStrictEquals, Properties, Press) {
	"use strict";

	Opa5.createPageObjects({
		onTheFLPPage: {
			actions: {
<% if (features.includes("Add buttons to Me Area")) { %>
				iPressOnAvatar: function () {
					return this.waitFor({
						id: "meAreaHeaderButton",
						actions: new Press(),
						errorMessage: "did not find the shell avatar button"
					});
				}
<% } %>
			},

			assertions: {
<% if (features.includes("Add a launchpad footer with button")) { %>
				iShouldSeeFooter: function () {
					return this.waitFor({
						id: "myFooter",
						success: function () {
							Opa5.assert.ok(true, "I am able to see shell header button");
						}
					});
				},
<% } %>
<% if (features.includes("Add buttons to Me Area")) { %>
				iShouldSeeHelpPageButton: function () {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.StandardListItem",
						matchers: new Properties({
							title: "Help for FLP page"
						}),
						success: function (aItems) {
							if (aItems && aItems.length > 0){
								aItems[0].firePress();
							}
							Opa5.assert.ok(true, "I am able to see help button");
						}
					});
				},
<% } %>
			}

		}

	});

});