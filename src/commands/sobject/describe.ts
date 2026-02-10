/*
 * Copyright 2026, Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
import type { DescribeSObjectResult } from '@jsforce/jsforce-node';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-schema', 'describe');

export class SObjectDescribe extends SfCommand<DescribeSObjectResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['force:schema:sobject:describe'];
  public static readonly deprecateAliases = true;
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
