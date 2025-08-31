/*
 * Copyright 2025, Salesforce, Inc.
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
import { isString, type AnyJson } from '@salesforce/ts-types';
import { TestContext, MockTestOrgData } from '@salesforce/core/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { SObjectDescribe } from '../../../src/commands/sobject/describe.js';

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
