const Generator = require("yeoman-generator"),
    fileaccess = require("../../helpers/fileaccess"),
    path = require("path"),
    glob = require("glob");

module.exports = class extends Generator {
    static displayName = "Add a new web app to an existing project";
    
    prompting() {
        
        if (this.options.isSubgeneratorCall) {
            return this.prompt([
            ]).then((answers) => {
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
