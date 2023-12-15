/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  SfCommand,
  Flags,
  orgApiVersionFlagWithDeprecations,
  requiredOrgFlagWithDeprecations,
  loglevel,
} from '@salesforce/sf-plugins-core';
import type { AnyJson } from '@salesforce/ts-types';
import { Messages } from '@salesforce/core';
import { DescribeSObjectResult } from 'jsforce';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-schema', 'describe');

export class SObjectDescribe extends SfCommand<DescribeSObjectResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['force:schema:sobject:describe'];
  public static readonly flags = {
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
      char: 't',
      summary: messages.getMessage('flags.use-tooling-api.summary'),
      aliases: ['usetoolingapi'],
    }),
  };

  public async run(): Promise<DescribeSObjectResult> {
    const { flags } = await this.parse(SObjectDescribe);
    const conn = flags['target-org'].getConnection(flags['api-version']);

    const description = flags['use-tooling-api']
      ? await conn.tooling.describe(flags.sobject)
      : await conn.describe(flags.sobject);

    this.styledJSON(description as AnyJson);

    return description;
  }
}
