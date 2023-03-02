/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { isString, AnyJson } from '@salesforce/ts-types';
import { TestContext, MockTestOrgData } from '@salesforce/core/lib/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { SObjectDescribe } from '../../../src/commands/sobject/describe';

describe('force:schema:sobject:describe', () => {
  const $$ = new TestContext();
  const testOrg = new MockTestOrgData();

  beforeEach(async () => {
    await $$.stubAuths(testOrg);
    stubSfCommandUx($$.SANDBOX);
  });

  afterEach(async () => {
    $$.SANDBOX.restore();
  });

  const expected = { actionOverrides: [], activateable: false, associateEntityType: null, associateParentEntity: null };

  it('logs types correctly with no errors and standard api', async () => {
    $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
      if (isString(request) && request.includes('/services/data/v42.0/sobjects/Account/describe')) {
        return Promise.resolve(expected);
      }
      return Promise.resolve({});
    };

    const result = await SObjectDescribe.run(['--sobjecttype', 'Account', '-u', 'testUser@test.com', '--json']);
    expect(result).to.deep.equal(expected);
  });

  it('logs types correctly with no errors and tooling api', async () => {
    $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
      if (isString(request) && request.includes('/services/data/v42.0/tooling/sobjects/ApexClass/describe')) {
        return Promise.resolve(expected);
      }
      return Promise.resolve({});
    };

    const result = await SObjectDescribe.run(['--sobjecttype', 'ApexClass', '-u', 'testUser@test.com', '-t', '--json']);
    expect(result).to.deep.equal(expected);
  });
});
