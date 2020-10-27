/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as os from 'os';
import { flags, FlagsConfig, SfdxCommand } from '@salesforce/command';
import { Connection, Messages } from '@salesforce/core';
import { DescribeSObjectResult } from 'jsforce';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-schema', 'describe');

export class SchemaSObjectDescribe extends SfdxCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessage('examples').split(os.EOL);
  public static readonly flagsConfig: FlagsConfig = {
    sobjecttype: flags.string({
      char: 's',
      required: true,
      description: messages.getMessage('flags.objectType'),
    }),
    usetoolingapi: flags.boolean({
      char: 't',
      description: messages.getMessage('flags.useTooling'),
    }),
  };

  public static readonly requiresUsername = true;
  public async run(): Promise<DescribeSObjectResult> {
    const conn: Connection = this.org.getConnection();
    const description: DescribeSObjectResult = this.flags.usetoolingapi
      ? await conn.tooling.describe(this.flags.sobjecttype)
      : await conn.describe(this.flags.sobjecttype);

    if (!this.flags.json) {
      this.ux.logJson(description);
    }

    return description;
  }
}
