const Generator = require("yeoman-generator"),
    fileaccess = require("../../helpers/fileaccess"),
    path = require("path"),
    glob = require("glob");

module.exports = class extends Generator {
    static hidden = true;

    prompting() {
        if (this.options.isSubgeneratorCall) {
            this.destinationRoot(this.options.cwd);
            this.options.oneTimeConfig = Object.assign({}, this.config.getAll(), this.options);
            this.options.oneTimeConfig.modulename = this.options.modulename;

            this.options.oneTimeConfig.appId =
                this.options.oneTimeConfig.namespaceUI5 +
                "." +
                (this.options.modulename === "uimodule"
                    ? this.options.oneTimeConfig.projectname
                    : this.options.modulename);
            this.options.oneTimeConfig.appURI =
                this.options.oneTimeConfig.namespaceURI +
                "/" +
                (this.options.modulename === "uimodule"
                    ? this.options.oneTimeConfig.projectname
                    : this.options.modulename);
            return;
        }
        throw 'This subgenerator is only intended for internal use. Please don"t call it directly.';
    }

    async writing() {
        const sModuleName = this.options.oneTimeConfig.modulename;
        const localResources = this.options.oneTimeConfig.ui5libs === "Local resources (SAPUI5)";
        const netweaver = this.options.oneTimeConfig.platform.includes("SAP NetWeaver");

        // Write files in new module folder
        this.sourceRoot(path.join(__dirname, "templates"));

        glob.sync("**", {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach((file) => {
            const sOrigin = this.templatePath(file);
            const sTarget = this.destinationPath(file.replace("uimodule", sModuleName).replace(/\/_/, "/"));

            const isUnneededXsApp =
                sTarget.includes("xs-app") && !(this.options.oneTimeConfig.platform === "SAP Launchpad service");

            if (isUnneededXsApp) {
                return;
            }

            this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
        });

        if (this.options.oneTimeConfig.platform === "SAP Launchpad service") {
            await fileaccess.manipulateJSON.call(this, "/" + sModuleName + "/webapp/manifest.json", {
                ["sap.cloud"]: {
                    service: this.options.oneTimeConfig.projectname + ".service"
                }
            });
        }

        // Append to Main package.json
        await fileaccess.manipulateJSON.call(this, "/package.json", function (packge) {
            packge.scripts["serve:" + sModuleName] = "ui5 serve --config=" + sModuleName + "/ui5.yaml";
            packge.scripts["build:ui"] += " build:" + sModuleName;
            let buildCommand = "ui5 build --config=" + sModuleName + "/ui5.yaml --clean-dest";
            if (localResources) {
                buildCommand += " --a";
            }
            if (!netweaver) {
                buildCommand += ` --dest ${sModuleName}/dist`;
                buildCommand += " --include-task=generateManifestBundle";
            } else {
                buildCommand += " --dest dist/" + sModuleName;
            }
            packge.scripts["build:" + sModuleName] = buildCommand;
            return packge;
        });

        if (this.options.oneTimeConfig.platform === "SAP Launchpad service") {
            await fileaccess.writeYAML.call(this, "/mta.yaml", (mta) => {
                const deployer = mta.modules.find((module) => module.name === "webapp_deployer");

                deployer["build-parameters"]["requires"].push({
                    name: sModuleName,
                    artifacts: [`dist/${sModuleName}.zip`],
                    ["target-path"]: "resources/"
                });

                mta.modules.push({
                    name: sModuleName,
                    type: "html5",
                    path: sModuleName,
                    "build-parameters": {
                        builder: "custom",
                        commands: [`npm run build:${sModuleName} --prefix ..`],
                        "supported-platforms": []
                    }
                });
                return mta;
            });
        }
    }
};
