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
import os from 'node:os';
import { isString, type AnyJson } from '@salesforce/ts-types';
import { TestContext, MockTestOrgData, shouldThrow } from '@salesforce/core/testSetup';
import { expect, assert } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { SfError } from '@salesforce/core';
import { SObjectList } from '../../../src/commands/sobject/list.js';

describe('force:schema:sobject:list', () => {
  const $$ = new TestContext();
  const testOrg = new MockTestOrgData();
  let sfCommandUxStubs: ReturnType<typeof stubSfCommandUx>;

  beforeEach(async () => {
    await $$.stubAuths(testOrg);
    $$.SANDBOX.stub(process.stderr, 'write');
    sfCommandUxStubs = stubSfCommandUx($$.SANDBOX);
  });

  it('should log metadata types correctly', async () => {
    $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
      if (isString(request) && request.includes('/services/data/v42.0/sobjects')) {
        return Promise.resolve({
          sobjects: [
            { custom: true, name: 'customMDT' },
            { custom: false, name: 'defaultMDT' },
          ],
        });
      }
      return Promise.resolve({});
    };

    await SObjectList.run(['--sobjecttypecategory', 'all', '-u', 'testUser@test.com']);
    expect(sfCommandUxStubs.log.getCalls().flatMap((call) => call.args)).to.deep.include(
      `customMDT${os.EOL}defaultMDT`
    );
  });

  it('should print the error when describeGlobal method fails', async () => {
    $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
      if (isString(request) && request.includes('/services/data/v42.0/sobjects')) {
        return Promise.reject(new Error('describeGlobal query failed'));
      }
      return Promise.resolve({});
    };

    try {
      await shouldThrow(SObjectList.run(['--sobjecttypecategory', 'all', '-u', 'testUser@test.com', '--json']));
    } catch (e) {
      assert(e instanceof SfError);
      expect(e.message).to.equal('describeGlobal query failed');
    }
  });

  it('should print the "noTypeFound" msg when no sobjects are found', async () => {
    $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
      if (isString(request) && request.includes('/services/data/v42.0/sobjects')) {
        return Promise.resolve({
          sobjects: [],
        });
      }
      throw new Error('Unexpected request');
    };
    await SObjectList.run(['-u', 'testUser@test.com']);

    expect(sfCommandUxStubs.log.getCalls().flatMap((call) => call.args)).to.deep.include('No ALL objects found.');
  });
});
