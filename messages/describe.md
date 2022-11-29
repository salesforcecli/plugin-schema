# summary

Displays the metadata for a standard or custom object.

# description

You must specify a Salesforce org to use, either with the --target-org flag or by setting your default org with the `target-org` configuration variable.

# examples

- Get the metadata of the "Account" standard object:

  <%= config.bin %> <%= command.id %> --target-org my-org --sobject Account

# flags.sobject.summary

The API name of the object to describe.

# flags.tooling-api.summary

Execute the request with the Tooling API.
