// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 DocumentSet in the list

sap.ui.define(
    [
        "sap/ui/test/Opa5",
        "<%=appURI%>/test/integration/arrangements/Startup",
        "<%=appURI%>/test/integration/FLPIntegrationJourney"
    ],
    function (Opa5, Startup) {
        "use strict";

        Opa5.extendConfig({
            arrangements: new Startup(),
            assertions: new Startup(),
            autoWait: true
        });
    }
);
