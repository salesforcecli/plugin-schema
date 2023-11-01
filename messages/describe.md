# summary

Display the metadata for a standard or custom object or a Tooling API object.

# description

The metadata is displayed in JSON format. See this topic for a description of each property: https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_describesobjects_describesobjectresult.htm.

This command displays metadata for Salesforce objects by default. Use the --use-tooling-api flag to view metadata for a Tooling API object.

# examples

- Display the metadata of the "Account" standard object in your default org:

  <%= config.bin %> <%= command.id %> --sobject Account

- Display the metadata of the "MyObject__c" custom object in the org with alias "my-scratch-org":

  <%= config.bin %> <%= command.id %> --sobject MyObject__c --target-org my-scratch-org

- Display the metadata of the ApexCodeCoverage Tooling API object in your default org:

  <%= config.bin %> <%= command.id %> --sobject ApexCodeCoverage --use-tooling-api

# flags.sobject.summary

API name of the object to describe.

# flags.use-tooling-api.summary

Use Tooling API to display metadata for Tooling API objects.
