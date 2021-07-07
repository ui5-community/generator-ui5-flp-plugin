const assert = require("yeoman-assert");
const path = require("path");
const helpers = require("yeoman-test");
const execa = require("execa");

const IsCIRun = process.env.CI;

function createTest(oPrompt) {
    describe(Object.values(oPrompt).join("-"), function () {
        this.timeout(200000);

        it("should be able to create the project", function () {
            return helpers.run(path.join(__dirname, "../generators/app")).withPrompts(oPrompt);
        });

        it("should create the necessary ui5 files", function () {
            return assert.file([
                "uimodule/ui5.yaml",
                `uimodule/webapp/Component.js`,
                "uimodule/webapp/flpSandbox.html",
                "uimodule/webapp/manifest.json"
            ]);
        });

        if (!!oPrompt.platform && oPrompt.platform !== "Static webserver" && oPrompt.platform !== "SAP NetWeaver") {
            it("ui5.yaml middleware should point to the right xs-app.json file", function () {
                return assert.fileContent(
                    "uimodule/ui5.yaml","xsappJson: uimodule/webapp/xs-app.json"
                );
            });
        }

        if (!!oPrompt.platform && oPrompt.platform === "SAP Launchpad service") {
            it("ui5.yaml should leverage the ui5 zipper task", function () {
                return assert.fileContent("uimodule/ui5.yaml", "name: ui5-task-zipper");
            });
        }

        it("should create an installable project", function () {
            return execa.commandSync("npm install");
        });

        if (oPrompt.features.includes("Add button to launchpad header")) {
            it("Component.js should contains sample code for FLP header", function () {
                return assert.fileContent("uimodule/webapp/Component.js", "oRenderer.addHeaderItem");
            });
        }

        if (oPrompt.features.includes("Add a launchpad footer with button")) {
            it("Component.js should contains sample code for FLP footer", function () {
                return assert.fileContent("uimodule/webapp/Component.js", "oRenderer.setFooterControl");
            });
        }

        if (oPrompt.features.includes("Add buttons to Me Area")) {
            it("Component.js should contains sample code for FLP me area", function () {
                return assert.fileContent("uimodule/webapp/Component.js", "oRenderer.addActionButton");
            });
        }
    });
}

describe("Basic project capabilities", function () {
    const testConfigurations = [
        {
            features: []
        },
        {
            ui5libs: "Content delivery network (SAPUI5)",
            features: []
        },
        {
            ui5libs: "Local resources (SAPUI5)",
            features: []
        },
        {
            ui5libs: "Local resources (SAPUI5)",
            platform: "SAP NetWeaver",
            features: []
        },
        {
            ui5libs: "Local resources (SAPUI5)",
            platform: "SAP Launchpad service",
            features: ["Add button to launchpad header"]
        },
        {
            features: ["Add button to launchpad header"]
        },
        {
            platform: "SAP Launchpad service",
            features: ["Add button to launchpad header"]
        },
        {
            features: ["Add button to launchpad header"]
        },
        {
            features: ["Add button to launchpad header", "Add a launchpad footer with button"]
        },
        {
            features: ["Add button to launchpad header", "Add a launchpad footer with button", "Add buttons to Me Area"]
        }
    ];

    testConfigurations.forEach((testConfig, index) => {
        if (!IsCIRun) {
            createTest(testConfig);
            return;
        }
        const totalNodes = Number(process.env.NODES_TOTAL);
        const nodeIdx = Number(process.env.NODE_INDEX);
        const testsPerNode = Math.ceil(testConfigurations.length / totalNodes);
        const lowerBound = testsPerNode * nodeIdx;
        const upperBound = testsPerNode * (nodeIdx + 1);

        if (lowerBound <= index && index < upperBound) {
            createTest(testConfig);
        }
    });
});
