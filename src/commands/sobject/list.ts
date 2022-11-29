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
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-schema', 'list');

export enum SObjectType {
  ALL,
  STANDARD,
  CUSTOM,
}

export class SObjectList extends SfCommand<string[]> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');
  public static readonly aliases = ['force:schema:sobject:list'];
  public static flags = {
    'target-org': requiredOrgFlagWithDeprecations,
    'api-version': orgApiVersionFlagWithDeprecations,
    loglevel,
    sobject: Flags.enum({
      char: 's',
      options: ['all', 'standard', 'custom', 'ALL', 'STANDARD', 'CUSTOM'],
      default: 'ALL',
      summary: messages.getMessage('flags.sobject.summary'),
      aliases: ['sobjecttypecategory', 'c'],
    }),
  };

  public async run(): Promise<string[]> {
    const { flags } = await this.parse(SObjectList);

    const category = flags.sobject.toUpperCase() as keyof typeof SObjectType;
    const type = SObjectType[category];

    const typeDescriptions: string[] = [];

    const allDescriptions = await flags['target-org'].getConnection(flags['api-version']).describeGlobal();

    let havePrinted = false;

    for (const sobject of allDescriptions.sobjects) {
      const isCustom = sobject.custom === true;
      const doPrint =
        type === SObjectType.ALL ||
        (type === SObjectType.CUSTOM && isCustom) ||
        (type === SObjectType.STANDARD && !isCustom);
      if (doPrint) {
        havePrinted = true;
        this.log(sobject.name);
        typeDescriptions.push(sobject.name);
      }
    }

    if (!havePrinted) {
      this.log(messages.getMessage('noTypeFound', [SObjectType[type]]));
    }

    return typeDescriptions;
  }
}
