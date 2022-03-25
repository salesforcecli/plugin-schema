/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* tslint:disable:no-empty */

import { AuthInfo, Connection, Org } from '@salesforce/core';
import { stubMethod } from '@salesforce/ts-sinon';
import { $$, test, expect } from '@salesforce/command/lib/test';

describe('force:schema:sobject:list', function (): void {
  const errorMessage = 'describeGlobal query failed';
  const expected = { actionOverrides: [], activateable: false, associateEntityType: null, associateParentEntity: null };
  async function prepareStubs(queryThrows = false, useTooling = false) {
    $$.SANDBOX.stub(Org.prototype, 'getConnection').returns(Connection.prototype);

    if (useTooling) {
      const testConnectionOptions = { loginUrl: 'connectionTest/loginUrl' };

      const testAuthInfo = {
        isOauth: () => true,
        getConnectionOptions: () => testConnectionOptions,
      };
      const conn = await Connection.create({ authInfo: testAuthInfo as AuthInfo });

      if (queryThrows) {
        stubMethod($$.SANDBOX, conn.tooling, 'describe').throws(errorMessage);
      } else {
        stubMethod($$.SANDBOX, conn.tooling, 'describe').resolves(expected);
      }
    } else {
      if (queryThrows) {
        stubMethod($$.SANDBOX, Connection.prototype, 'describeGlobal').throws(errorMessage);
      } else {
        stubMethod($$.SANDBOX, Connection.prototype, 'describeGlobal').resolves(expected);
      }
    }
  }

  it('logs types correctly with no errors and standard api', () => {
    test
      .do(() => prepareStubs(false, false))
      .stdout()
      .command(['force:schema:sobject:describe', '--sobjecttype', 'Account', '-u', 'testUser@test.com', '--json'])
      .it('logs types correctly with no errors and standard api', (ctx) => {
        const sobjects = JSON.parse(ctx.stdout).result;
        expect(sobjects).to.deep.equal(expected);
      });
  });

  it('logs types correctly with no errors and tooling api', () => {
    test
      .do(() => prepareStubs(false, true))
      .stdout()
      .command(['force:schema:sobject:describe', '--sobjecttype', 'Account', '-u', 'testUser@test.com', '-t', '--json'])
      .it('logs types correctly with no errors and tooling api', (ctx) => {
        const sobjects = JSON.parse(ctx.stdout).result;
        expect(sobjects).to.deep.equal(expected);
      });
  });

  it('logs types correctly with errors and standard api', () => {
    test
      .do(() => prepareStubs(true, false))
      .stdout()
      .command(['force:schema:sobject:describe', '--sobjecttype', 'Account', '-u', 'testUser@test.com', '--json'])
      .it('logs types correctly with errors and standard api', (ctx) => {
        const sobjects = JSON.parse(ctx.stdout).result;
        expect(sobjects).to.deep.equal(expected);
      });
  });

  it('logs types correctly with errors and tooling api', () => {
    test
      .do(() => prepareStubs(true, true))
      .stdout()
      .command(['force:schema:sobject:describe', '--sobjecttype', 'Account', '-u', 'testUser@test.com', '-t', '--json'])
      .it('logs types correctly with errors and tooling api', (ctx) => {
        const sobjects = JSON.parse(ctx.stdout).result;
        expect(sobjects).to.deep.equal(expected);
      });
  });
});
