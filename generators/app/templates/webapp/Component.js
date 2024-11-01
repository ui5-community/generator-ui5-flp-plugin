sap.ui.define([
	"sap/ui/core/Component",
	"sap/base/util/ObjectPath",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast"
], function (Component, ObjectPath, Button, Bar, MessageToast) {

	return Component.extend("<%=appId%>.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			var rendererPromise = this._getRenderer();
			var oResourceBundle = this.getModel("i18n").getResourceBundle();

			// This is example code. Please replace with your implementation!
<% if (features.includes("Add button to launchpad header")) { %>
			/**
			 * Add item to the header
			 */
			rendererPromise.then(function (oRenderer) {
				oRenderer.addHeaderItem({
					icon: "sap-icon://add",
					tooltip: "Add bookmark",
					press: function () {
						MessageToast.show("This SAP Fiori Launchpad has been extended to improve your experience");
					}
				}, true, true);
			});
<% } %>
<% if (features.includes("Add a launchpad footer with button")) { %>
			/**
			 * Add a footer with a button
			 */
			rendererPromise.then(function (oRenderer) {
				oRenderer.setFooterControl("sap.m.Bar", {
					id: "myFooter",
					contentLeft: [new Button({
						text: "Important Information",
						press: function () {
							MessageToast.show("This SAP Fiori Launchpad has been extended to improve your experience");
						}
					})]
				});
			});
<% } %>
<% if (features.includes("Add buttons to Me Area")) { %>
			/**
			 * Add two buttons to the options bar (previous called action menu) in the Me Area.
			 * The first button is only visible if the Home page of SAP Fiori launchpad is open.
			 */
			rendererPromise.then(function (oRenderer) {
				var _oResourceBundle = oResourceBundle;
				oRenderer.addActionButton("sap.m.Button", {
					id: "myHomeButton",
					icon: "sap-icon://sys-help-2",
					text: _oResourceBundle.getText("buttonText"),
					press: function () {
						MessageToast.show(_oResourceBundle.getText("msgMeAreaText"));
					}
				}, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.Home]);

				/*
				 * The second button is only visible when an app is open.
				 */
				oRenderer.addActionButton("sap.m.Button", {
					id: "myAppButton",
					icon: "sap-icon://sys-help",
					text: _oResourceBundle.getText("buttonText"),
					press: function () {
						MessageToast.show(_oResourceBundle.getText("msgMeAreaTextApp"));
					}
				}, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.App]);
			}.bind(this));
<% } %>
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {Promise} a Promise which will resolve with the renderer instance, 
		 * 					   or be rejected with an error message.
		 */
		_getRenderer: function () {
			return new Promise(function(fnResolve, fnReject) {
				this._oShellContainer = ObjectPath.get("sap.ushell.Container");
				if (!this._oShellContainer) {
					fnReject(
						"Illegal state: shell container not available; this component must be executed in a unified shell runtime context."
					);
				} else {
					var oRenderer = this._oShellContainer.getRenderer();
					if (oRenderer) {
						fnResolve(oRenderer);
					} else {
						// renderer not initialized yet, listen to rendererCreated event
						this._onRendererCreated = function(oEvent) {
							oRenderer = oEvent.getParameter("renderer");
							if (oRenderer) {
								fnResolve(oRenderer);
							} else {
								fnReject(
									"Illegal state: shell renderer not available after receiving 'rendererLoaded' event."
								);
							}
						};
						this._oShellContainer.attachRendererCreatedEvent(
							this._onRendererCreated
						);
					}
				}
			}.bind(this));
		},

		exit: function () {
		    if (this._oShellContainer && this._onRendererCreated) {
			this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
		    }
		}
	});
});
