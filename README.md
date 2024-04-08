# plugin-schema

[![NPM](https://img.shields.io/npm/v/@salesforce/plugin-schema.svg?label=@salesforce/plugin-schema)](https://www.npmjs.com/package/@salesforce/plugin-schema) [![Downloads/week](https://img.shields.io/npm/dw/@salesforce/plugin-schema.svg)](https://npmjs.org/package/@salesforce/plugin-schema) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/plugin-schema/main/LICENSE.txt)

Commands to interact with salesforce sobject schemas

This plugin is bundled with the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli). For more information on the CLI, read the [getting started guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm).

We always recommend using the latest version of these commands bundled with the CLI, however, you can install a specific version or tag if needed.

## Install

```bash
sfdx plugins:install schema@x.y.z
```

## Issues

Please report any issues at https://github.com/forcedotcom/cli/issues

## Contributing

1. Please read our [Code of Conduct](CODE_OF_CONDUCT.md)
2. Create a new issue before starting your project so that we can keep track of
   what you are trying to add/fix. That way, we can also offer suggestions or
   let you know if there is already an effort in progress.
3. Fork this repository.
4. [Build the plugin locally](#build)
5. Create a _topic_ branch in your fork. Note, this step is recommended but technically not required if contributing using a fork.
6. Edit the code in your fork.
7. Write appropriate tests for your changes. Try to achieve at least 95% code coverage on any new code. No pull request will be accepted without unit tests.
8. Sign CLA (see [CLA](#cla) below).
9. Send us a pull request when you are done. We'll review your code, suggest any needed changes, and merge it in.

### CLA

External contributors will be required to sign a Contributor's License
Agreement. You can do so by going to https://cla.salesforce.com/sign-cla.

### Build

To build the plugin locally, make sure to have yarn installed and run the following commands:

```bash
# Clone the repository
git clone git@github.com:salesforcecli/plugin-schema

# Install the dependencies and compile
yarn install
yarn build
```

To use your plugin, run using the local `./bin/dev` or `./bin/dev.cmd` file.

```bash
# Run using local run file.
./bin/dev schema
```

There should be no differences when running via the Salesforce CLI or using the local run file. However, it can be useful to link the plugin to do some additional testing or run your commands from anywhere on your machine.

```bash
# Link your plugin to the sfdx cli
sfdx plugins:link .
# To verify
sfdx plugins
```

## Commands

<!-- commands -->

- [`sf sobject describe`](#sf-sobject-describe)
- [`sf sobject list`](#sf-sobject-list)

## `sf sobject describe`

Display the metadata for a standard or custom object or a Tooling API object.

```
USAGE
  $ sf sobject describe -o <value> -s <value> [--json] [--flags-dir <value>] [--api-version <value>] [-t]

FLAGS
  -o, --target-org=<value>   (required) Username or alias of the target org. Not required if the `target-org`
                             configuration variable is already set.
  -s, --sobject=<value>      (required) API name of the object to describe.
  -t, --use-tooling-api      Use Tooling API to display metadata for Tooling API objects.
      --api-version=<value>  Override the api version used for api requests made by this command

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  Display the metadata for a standard or custom object or a Tooling API object.

  The metadata is displayed in JSON format. See this topic for a description of each property: https://developer.salesfo
  rce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_describesobjects_describesobjectresult.htm.

  This command displays metadata for Salesforce objects by default. Use the --use-tooling-api flag to view metadata for
  a Tooling API object.

ALIASES
  $ sf force schema sobject describe

EXAMPLES
  Display the metadata of the "Account" standard object in your default org:

    $ sf sobject describe --sobject Account

  Display the metadata of the "MyObject__c" custom object in the org with alias "my-scratch-org":

    $ sf sobject describe --sobject MyObject__c --target-org my-scratch-org

  Display the metadata of the ApexCodeCoverage Tooling API object in your default org:

    $ sf sobject describe --sobject ApexCodeCoverage --use-tooling-api
```

_See code: [src/commands/sobject/describe.ts](https://github.com/salesforcecli/plugin-schema/blob/3.2.1/src/commands/sobject/describe.ts)_

## `sf sobject list`

List all Salesforce objects of a specified category.

```
USAGE
  $ sf sobject list -o <value> [--json] [--flags-dir <value>] [--api-version <value>] [-s <value>]

FLAGS
  -o, --target-org=<value>   (required) Username or alias of the target org. Not required if the `target-org`
                             configuration variable is already set.
  -s, --sobject=<value>      [default: ALL] Category of objects to list.
      --api-version=<value>  Override the api version used for api requests made by this command

GLOBAL FLAGS
  --flags-dir=<value>  Import flag values from a directory.
  --json               Format output as json.

DESCRIPTION
  List all Salesforce objects of a specified category.

  You can list the standard objects, custom objects, or all. The lists include only Salesforce objects, not Tooling API
  objects.

ALIASES
  $ sf force schema sobject list

EXAMPLES
  List all objects in your default org:

    $ sf sobject list --sobject all

  List only custom objects in the org with alias "my-scratch-org":

    $ sf sobject list --sobject custom --target-org my-scratch-org
```

_See code: [src/commands/sobject/list.ts](https://github.com/salesforcecli/plugin-schema/blob/3.2.1/src/commands/sobject/list.ts)_

<!-- commandsstop -->
