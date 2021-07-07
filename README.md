# Generator for SAPUI5 Fiori Launchpad Plugin
> Generator for UI5 Fiori Launchpad Plugin using UI5 Tooling. (based on the [Easy UI5 Generator](https://github.com/SAP/generator-easy-ui5))  
> Includes
> - Fiori Launchpad Plugin Component
> - Shell Extension Code Samples
> - Opa5 Test enabled

## Usage with easy-ui5

```bash
$> npm i -g yo
$> yo easy-ui5 flp-plugin

     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `
```

Run you can use `npm start` (or `yarn start`) to start the local server for development.

## Standalone usage

Note the different greeting when the generator starts.

```bash
$> npm i -g yo
$> yo ./generator-ui5-project

     _-----_     ╭──────────────────────────╮
    |       |    │      Welcome to the      │
    |--(o)--|    │    generator-flp-plugin  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `
```

## Target platforms

During the prompting phase, the generator will ask on which target platform your app should run. Currently, the following options are available:

### Static webserver

This is the most basic option. Choose this option if you want to deploy the web app in your custom environment or host it on an arbitrary server.

### SAP Launchpad service

Use this option if you would like to develop a Fiori Launchpad application that should run on Cloud Foundry. The generator will install a module that adds Fiori Launchpad resources to the HTML5 application repository.

### SAP NetWeaver

Use this option if you want to deploy your application(s) to the SAP NetWeaver ABAP Repository.

## Test Application
```bash
npm run test
```

## Deployment

Depending on your target platform you'll need to install additional tools:

### Cloud Foundry

Required tools:

1. [Create a free account](https://developers.sap.com/mena/tutorials/hcp-create-trial-account.html) on SAP BTP Trial
2. [Install](https://developers.sap.com/tutorials/cp-cf-download-cli.html) the Cloud Foundry Command Line Interface
    ```sh
    cf login
    ```
3. [Install](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin) the MultiApps CF CLI Plugin

Deployment steps:

Call this command from the root directory to deploy the application to Cloud Foundry

```
npm run deploy
```

### SAP NetWeaver

Deployment steps:

Update the ui5.yaml file with your system settings (user, password & server) and ABAP repository settings (package, BSP Container & Transport).
Run following command to deploy the application to SAP NetWeaver

```
npm run deploy
```
## Support

Please use the GitHub bug tracking system to post questions, bug reports or to create pull requests.