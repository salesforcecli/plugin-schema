# summary

List all Salesforce objects of a specified category.

# description

You must specify a Salesforce org to use, either with the --target-org flag or by setting your default org with the `target-org` configuration variable.

# examples

- List all objects:

  <%= config.bin %> <%= command.id %> --target-org my-org --sobject all

- Only list custom objects:

  <%= config.bin %> <%= command.id %> --target-org my-org --sobject custom

# flags.sobject.summary

Type of objects to list.

# noTypeFound

No %s objects found.
