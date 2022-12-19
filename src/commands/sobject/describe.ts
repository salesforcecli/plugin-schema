/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { CliUx } from '@oclif/core';
import {
  SfCommand,
  Flags,
  orgApiVersionFlagWithDeprecations,
  requiredOrgFlagWithDeprecations,
  loglevel,
} from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { DescribeSObjectResult } from 'jsforce';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-schema', 'describe');

export class SObjectDescribe extends SfCommand<DescribeSObjectResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['force:schema:sobject:describe'];
  public static flags = {
    'target-org': requiredOrgFlagWithDeprecations,
    'api-version': orgApiVersionFlagWithDeprecations,
    loglevel,
    sobject: Flags.string({
      char: 's',
      required: true,
      summary: messages.getMessage('flags.sobject.summary'),
      aliases: ['sobjecttype'],
    }),
    'use-tooling-api': Flags.boolean({
      summary: messages.getMessage('flags.tooling-api.summary'),
      aliases: ['usetoolingapi', 't'],
    }),
  };

  public async run(): Promise<DescribeSObjectResult> {
    const { flags } = await this.parse(SObjectDescribe);
    const conn = flags['target-org'].getConnection(flags['api-version']);

    const description = flags['use-tooling-api']
      ? await conn.tooling.describe(flags.sobject)
      : await conn.describe(flags.sobject);

    if (!flags.json) {
      CliUx.ux.styledJSON(description);
    }

    return description;
  }
}
