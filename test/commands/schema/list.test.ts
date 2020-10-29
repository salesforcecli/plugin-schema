/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* tslint:disable:no-empty */

import { Connection, Org } from '@salesforce/core';
import { $$, test, expect } from '@salesforce/command/lib/test';
import { stubMethod } from '@salesforce/ts-sinon';

describe('force:schema:sobject:list', function (): void {
  const errorMessage = 'describeGlobal query failed';
  function prepareStubs(queryThrows = false) {
    stubMethod($$.SANDBOX, Org.prototype, 'getConnection').callsFake(() => Connection.prototype);
    if (queryThrows) {
      stubMethod($$.SANDBOX, Connection.prototype, 'describeGlobal').throws(errorMessage);
    } else {
      stubMethod($$.SANDBOX, Connection.prototype, 'describeGlobal').resolves({
        sobjects: [
          { custom: true, name: 'customMDT' },
          { custom: false, name: 'defaultMDT' },
        ],
      });
    }
  }

  it('logs types correctly', () => {
    test
      .do(() => prepareStubs())
      .stdout()
      .command(['force:schema:sobject:list', '--sobjecttypecategory', 'all', '-u', 'testUser@test.com', '--json'])
      .it('should log metadata types correctly', (ctx) => {
        const sobjects = JSON.parse(ctx.stdout).result;
        expect(sobjects).to.deep.equal(['customMDT', 'defaultMDT']);
      });
  });

  it('Should throw on a describe by type request error', async function (): Promise<void> {
    test
      .do(() => prepareStubs(true))
      .stdout()
      .command(['force:schema:sobject:list', '--sobjecttypecategory', 'all', '-u', 'testUser@test.com', '--json'])
      .it('should print the error when describeGlobal method fails', (ctx) => {
        const err = JSON.parse(ctx.stdout).result;
        expect(err).to.deep.equal(errorMessage);
      });
  });
});
