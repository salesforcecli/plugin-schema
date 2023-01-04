# summary

List all Salesforce objects of a specified category.

# description

You can list the standard objects, custom objects, or all. The lists include only Salesforce objects, not Tooling API objects.

# examples

- List all objects in your default org:

  <%= config.bin %> <%= command.id %> --sobject all

- List only custom objects in the org with alias "my-scratch-org":

  <%= config.bin %> <%= command.id %> --sobject custom --target-org my-scratch-org

# flags.sobject.summary

Category of objects to list.

# invalid-sobject-type

"--sobject" flag can be set only to <all|custom|standard>."

# noTypeFound

No %s objects found.
