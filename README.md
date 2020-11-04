# plugin-schema

Commands to interact with salesforce sobject schemas

## Getting Started

To use, install the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli) and run the following commands.

```
Verify the CLI is installed
  $ sfdx (-v | --version)
Install the @salesforce/plugin-schema plugin
  $ sfdx plugins:install @salesforce/plugin-schema
To run a command
  $ sfdx [command]
```

To build the plugin locally, make sure to have yarn installed and run the following commands:

```
Clone the repository
  $ git clone git@github.com:salesforcecli/plugin-schema
Install the dependencies and compile
  $ yarn install
  $ yarn prepack
Link your plugin to the sfdx cli
  $ sfdx plugins:link .
To verify
  $ sfdx plugins
```

## Commands

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
