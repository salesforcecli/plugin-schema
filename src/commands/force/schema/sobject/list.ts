/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, FlagsConfig, SfdxCommand } from '@salesforce/command';
import { Connection, Messages, SfdxError } from '@salesforce/core';
import { DescribeGlobalSObjectResult, DescribeGlobalResult } from 'jsforce';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-schema', 'list');

// eslint-disable-next-line no-shadow
export enum SObjectType {
  ALL,
  STANDARD,
  CUSTOM,
}

export class SchemaSobjectList extends SfdxCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessage('examples').split(os.EOL);
  public static readonly flagsConfig: FlagsConfig = {
    sobjecttypecategory: flags.string({
      char: 'c',
      default: 'ALL',
      validate: (val) => {
        const capitalized = val.toUpperCase();
        const result = capitalized === 'ALL' || capitalized === 'STANDARD' || capitalized === 'CUSTOM';
        if (!result) {
          throw SfdxError.create('@salesforce/plugin-schema', 'list', 'flags.invalidTypeError');
        }
        return result;
      },
      description: messages.getMessage('flags.typeDescription'),
    }),
  };
  public static readonly requiresUsername = true;

  public async run(): Promise<string[]> {
    const category = (this.flags.sobjecttypecategory as string).toUpperCase() as keyof typeof SObjectType;
    const type = SObjectType[category];

    const typeDescriptions: string[] = [];

    const conn: Connection = this.org.getConnection();
    const allDescriptions: DescribeGlobalResult = await conn.describeGlobal();

    let havePrinted = false;

    allDescriptions.sobjects.forEach((sobject: DescribeGlobalSObjectResult) => {
      const isCustom = sobject.custom === true;
      const doPrint =
        type === SObjectType.ALL ||
        (type === SObjectType.CUSTOM && isCustom) ||
        (type === SObjectType.STANDARD && !isCustom);
      if (doPrint) {
        havePrinted = true;
        this.ux.log(sobject.name);
        typeDescriptions.push(sobject.name);
      }
    });

    if (!havePrinted) {
      this.ux.log(messages.getMessage('noTypeFound', [SObjectType[type]]));
    }

    return typeDescriptions;
  }
}
