# plugin-schema

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

To use your plugin, run using the local `./bin/run` or `./bin/run.cmd` file.

```bash
# Run using local run file.
./bin/run schema
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

- [`sfdx force:schema:sobject:describe -s <string> [-t] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`]

describe an sobject in your org

```
USAGE
  $ sfdx force:schema:sobject:describe -s <string> [-t] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -s, --sobjecttype=sobjecttype                                                     (required) the API name of
                                                                                    the object to describe

  -t, --usetoolingapi                                                               execute with Tooling API

  -u, --targetusername=targetusername                                               username or alias for the
                                                                                    target org; overrides
                                                                                    default target org

  --apiversion=apiversion                                                           override the api version
                                                                                    used for api requests made
                                                                                    by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging
                                                                                    level for this command
                                                                                    invocation

  Examples:
      $ sfdx force:schema:sobject:describe -s Account
      $ sfdx force:schema:sobject:describe -s MyObject__c
      $ sfdx force:schema:sobject:describe -s ApexClass -t
```

- [`sfdx force:schema:sobject:list -c <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`]

list all objects of a specified category

```
USAGE
  $ sfdx force:schema:sobject:list -c <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --sobjecttypecategory=sobjecttypecategory                                     (required) the type of
                                                                                    objects to list
                                                                                    (all|custom|standard)

  -u, --targetusername=targetusername                                               username or alias for the
                                                                                    target org; overrides
                                                                                    default target org

  --apiversion=apiversion                                                           override the api version
                                                                                    used for api requests made
                                                                                    by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging
                                                                                    level for this command
                                                                                    invocation

  Lists all objects, custom objects, or standard objects in the org.

  Examples:
      $ sfdx force:schema:sobject:list -c all
      $ sfdx force:schema:sobject:list -c custom
      $ sfdx force:schema:sobject:list -c standard


```

<!-- commandsstop -->
