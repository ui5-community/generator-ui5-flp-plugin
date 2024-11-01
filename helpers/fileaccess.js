import objectAssignDeep from "object-assign-deep";
import yaml from "yaml"


// overide can be an object or a function that receives the current object
const writeJSON = async function (filePath, override) {
    try {
        const fullFilePath = process.cwd() + filePath;
        let oldContent = {};
        if (this.fs.exists(fullFilePath)) {
            oldContent = this.fs.readJSON(fullFilePath);
        }

        const newContent =
            typeof override === "function"
                ? override(oldContent)
                : objectAssignDeep.withOptions(oldContent, [override], { arrayBehaviour: "merge" });

        this.fs.writeJSON(fullFilePath, newContent);
        if (!this.options.isSubgeneratorCall && this.config.get("setupCompleted")) {
            this.log(`Updated file: ${filePath}`);
        }
    } catch (e) {
        this.log(`Error during the manipulation of the ${filePath} file: ${e}`);
        throw e;
    }
};

// overide can be an object or a function that receives the current object
const writeYAML = async function (filePath, override) {
    try {
        const fullFilePath = process.cwd() + filePath;
        let oldContent = {};
        if (this.fs.exists(fullFilePath)) {
            oldContent = yaml.parse(this.fs.read(fullFilePath));
        }

        const newContent =
            typeof override === "function"
                ? override(oldContent)
                : objectAssignDeep.withOptions(oldContent, [override], { arrayBehaviour: "merge" });

        this.fs.write(fullFilePath, yaml.stringify(newContent));

        if (!this.options.isSubgeneratorCall && this.config.get("setupCompleted")) {
            this.log(`Updated file: ${filePath}`);
        }
    } catch (e) {
        this.log(`Error during the manipulation of the ${filePath} file: ${e}`);
        throw e;
    }
};

// overide can be an object or a function that receives the current object
const manipulateJSON = async function (filePath, override) {
    try {
        const fullFilePath = process.cwd() + filePath;
        const oldContent = this.fs.readJSON(fullFilePath);

        const newContent =
            typeof override === "function"
                ? override(oldContent)
                : objectAssignDeep.withOptions(oldContent, [override], { arrayBehaviour: "merge" });

        this.fs.writeJSON(fullFilePath, newContent);
        if (!this.options.isSubgeneratorCall && this.config.get("setupCompleted")) {
            this.log(`Updated file: ${filePath}`);
        }
    } catch (e) {
        this.log(`Error during the manipulation of the ${filePath} file: ${e}`);
        throw e;
    }
};

// overide can be an object or a function that receives the current object
const manipulateYAML = async function (filePath, override) {
    try {
        const fullFilePath = process.cwd() + filePath;
        const oldContent = yaml.parse(this.fs.read(fullFilePath));

        const newContent =
            typeof override === "function"
                ? override(oldContent)
                : objectAssignDeep.withOptions(oldContent, [override], { arrayBehaviour: "merge" });

        this.fs.write(fullFilePath, yaml.stringify(newContent));

        !this.options.isSubgeneratorCall && this.log(`Updated file: ${filePath}`);
    } catch (e) {
        this.log(`Error during the manipulation of the ${filePath} file: ${e}`);
        throw e;
    }
};

export  { writeJSON,writeYAML,manipulateJSON,manipulateYAML }
