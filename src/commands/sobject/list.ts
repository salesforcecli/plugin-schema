/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import os from 'node:os';

import {
  SfCommand,
  Flags,
  orgApiVersionFlagWithDeprecations,
  requiredOrgFlagWithDeprecations,
  loglevel,
} from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-schema', 'list');

export enum SObjectType {
  ALL,
  STANDARD,
  CUSTOM,
}

export type SObjectListResult = string[];

export class SObjectList extends SfCommand<SObjectListResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['force:schema:sobject:list'];
  public static readonly deprecateAliases = true;

  public static readonly flags = {
    'target-org': requiredOrgFlagWithDeprecations,
    'api-version': orgApiVersionFlagWithDeprecations,
    loglevel,
    sobject: Flags.string({
      char: 's',
      default: 'ALL',
      summary: messages.getMessage('flags.sobject.summary'),
      aliases: ['sobjecttypecategory', 'c'],
      parse: (val) => {
        const lowercasedType = val.toLowerCase();
        if (!['all', 'standard', 'custom'].includes(lowercasedType)) {
          throw messages.createError('invalid-sobject-type');
        }
        return Promise.resolve(lowercasedType);
      },
    }),
  };

  public async run(): Promise<SObjectListResult> {
    const { flags } = await this.parse(SObjectList);

    const category = flags.sobject.toUpperCase() as keyof typeof SObjectType;
    const type = SObjectType[category];

    const allDescriptions = await flags['target-org'].getConnection(flags['api-version']).describeGlobal();

    const sobjects = allDescriptions.sobjects
      .filter((sobject) => {
        const isCustom = sobject.custom;
        return (
          type === SObjectType.ALL ||
          (type === SObjectType.CUSTOM && isCustom) ||
          (type === SObjectType.STANDARD && !isCustom)
        );
      })
      .map((sobject) => sobject.name);

    if (sobjects.length) {
      this.log(sobjects.join(os.EOL));
    } else {
      this.log(messages.getMessage('noTypeFound', [SObjectType[type]]));
    }

    return sobjects;
  }
}
