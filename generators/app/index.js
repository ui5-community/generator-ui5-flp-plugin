"use strict";
const Generator = require("yeoman-generator"),
    fileaccess = require("../../helpers/fileaccess"),
    path = require("path"),
    chalk = require("chalk"),
    yosay = require("yosay"),
    glob = require("glob");

module.exports = class extends Generator {
    static displayName = "Create a new Fiori Launchpad Plugin";

    prompting() {
        if (!this.options.embedded) {
            this.log(yosay(`Welcome to the ${chalk.red("generator-flp-plugin")} generator!`));
        }

        return this.prompt([
            {
                type: "input",
                name: "projectname",
                message: "How do you want to name this project?",
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
                message: "Which namespace do you want to use?",
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
                },
            },
            {
                type: "confirm",
                name: "newdir",
                message: "Would you like to create a new directory for the project?",
                default: true
            }
        ]).then((answers) => {
            if (answers.newdir) {
                this.destinationRoot(`${answers.namespaceUI5}.${answers.projectname}`);
            }
            this.config.set(answers);
            this.config.set("namespaceURI", answers.namespaceUI5.split(".").join("/"));
        });
    }

    async writing() {
        const oConfig = this.config.getAll();

        this.sourceRoot(path.join(__dirname, "templates"));
        glob.sync("**", {
            cwd: this.sourceRoot(),
            nodir: true
        }).forEach((file) => {
            const sOrigin = this.templatePath(file);
            const sTarget = this.destinationPath(file.replace(/^_/, "").replace(/\/_/, "/"));

            this.fs.copyTpl(sOrigin, sTarget, oConfig);
        });

        const oSubGen = Object.assign({}, oConfig);
        oSubGen.isSubgeneratorCall = true;
        oSubGen.cwd = this.destinationRoot();
        oSubGen.modulename = "uimodule";

        this.composeWith(require.resolve("../newwebapp"), oSubGen);
    }

    async addPackage() {
        const oConfig = this.config.getAll();
        let packge = {
            name: oConfig.projectname,
            version: "0.0.1",
            scripts: {
                start: "ui5 serve --config=uimodule/ui5.yaml  --open flpSandbox.html",
                "build:ui": "run-s ",
                test: "run-s lint karma",
                "karma-ci": "karma start karma-ci.conf.js",
                clearCoverage: "shx rm -rf coverage",
                karma: "run-s clearCoverage karma-ci",
                lint: "eslint ."
            },
            devDependencies: {
                shx: "^0.3.3",
                "@ui5/cli": "^2.11.2",
                "ui5-middleware-livereload": "^0.5.4",
                karma: "^6.3.4",
                "karma-chrome-launcher": "^3.1.0",
                "karma-coverage": "^2.0.3",
                "karma-ui5": "^2.3.4",
                "npm-run-all": "^4.1.5",
                eslint: "^7.29.0"
            },
            ui5: {
                dependencies: ["ui5-middleware-livereload"]
            }
        };
        await fileaccess.writeJSON.call(this, "/package.json", packge);
    }

    install() {
        this.config.set("setupCompleted", true);
        this.installDependencies({
            bower: false,
            npm: true
        });
    }

    end() {
        this.spawnCommandSync("git", ["init", "--quiet"], {
            cwd: this.destinationPath()
        });
        this.spawnCommandSync("git", ["add", "."], {
            cwd: this.destinationPath()
        });
        this.spawnCommandSync(
            "git",
            ["commit", "--quiet", "--allow-empty", "-m", "Initialize repository with easy-ui5"],
            {
                cwd: this.destinationPath()
            }
        );
    }
};
