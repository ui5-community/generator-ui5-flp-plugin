const Generator = require("yeoman-generator"),
    fileaccess = require("../../helpers/fileaccess"),
    path = require("path"),
    glob = require("glob");

module.exports = class extends Generator {
    static displayName = "Add a new web app to an existing project";

    prompting() {
        if (this.options.isSubgeneratorCall) {
            return this.prompt([]).then((answers) => {
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
            });
        }
        var aPrompt = [
            {
                type: "input",
                name: "modulename",
                message: "What is the name of the module?",
                validate: (s) => {
                    if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
                        return true;
                    }
                    return "Please use alpha numeric characters only for the module name.";
                }
            }
        ];
        if (!this.config.getAll().features) {
            aPrompt = aPrompt.concat([
                {
                    type: "input",
                    name: "projectname",
                    message:
                        "Seems like this project has not been generated with Easy-UI5. Please enter the name your project.",
                    validate: (s) => {
                        if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
                            return true;
                        }
                        return "Please use alpha numeric characters only for the project name.";
                    },
                    default: "myFlpPlugin"
                },
                {
                    type: "input",
                    name: "namespaceUI5",
                    message: "Please enter the namespace you use currently",
                    validate: (s) => {
                        if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
                            return true;
                        }
                        return "Please use alpha numeric characters and dots only for the namespace.";
                    },
                    default: "com.myorg"
                },
                {
                    type: "list",
                    name: "ui5libs",
                    message: "Where should your UI5 libs be served from?",
                    choices: (props) => {
                        return ["Content delivery network (SAPUI5)", "Local resources (SAPUI5)"];
                    },
                    default: "Content delivery network (SAPUI5)"
                },
                {
                    type: "checkbox",
                    name: "features",
                    message: "Do you want to add sample code?",
                    choices: (props) => {
                        return [
                            "Add button to launchpad header",
                            "Add a launchpad footer with button",
                            "Add buttons to Me Area"
                        ];
                    }
                },
            ]);
        }
        return this.prompt(aPrompt).then((answers) => {
            this.options.oneTimeConfig = this.config.getAll();
            this.options.oneTimeConfig.modulename = answers.modulename;
            if (answers.projectname) {
                this.options.oneTimeConfig.projectname = answers.projectname;
                this.options.oneTimeConfig.ui5libs = answers.ui5libs;
                this.options.oneTimeConfig.features = answers.features;
                this.options.oneTimeConfig.namespaceUI5 = answers.namespaceUI5;
                this.options.oneTimeConfig.namespaceURI = answers.namespaceUI5.split(".").join("/");
                this.options.oneTimeConfig.appId =
                this.options.oneTimeConfig.namespaceUI5 +
                "." +
                (answers.modulename === "uimodule" ? this.options.oneTimeConfig.projectname : answers.modulename);
            this.options.oneTimeConfig.appURI =
                this.options.oneTimeConfig.namespaceURI +
                "/" +
                (answers.modulename === "uimodule" ? this.options.oneTimeConfig.projectname : answers.modulename);

            }
        }); 
    }

    async writing() {
        const sModuleName = this.options.oneTimeConfig.modulename;
        // Write files in new module folder
        this.sourceRoot(path.join(__dirname, "templates"));

        glob.sync("**", {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach((file) => {
            const sOrigin = this.templatePath(file);
            const sTarget = this.destinationPath(file.replace("uimodule", sModuleName).replace(/\/_/, "/"));
            this.fs.copyTpl(sOrigin, sTarget, this.options.oneTimeConfig);
        });
    }
};
