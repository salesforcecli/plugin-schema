/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as path from 'path';
import { isString, AnyJson } from '@salesforce/ts-types';
import { TestContext, MockTestOrgData } from '@salesforce/core/lib/testSetup';
import { Config } from '@oclif/core';
import { expect } from 'chai';
import stripAnsi = require('strip-ansi');
import { SObjectDescribe } from '../../../src/commands/sobject/describe';

describe('force:schema:sobject:describe', () => {
  const $$ = new TestContext();
  const testOrg = new MockTestOrgData();
  let config: Config;

  let stdoutSpy: sinon.SinonSpy;

  before(async () => {
    config = new Config({ root: path.resolve(__dirname, '../../..') });
    await config.load();
  });

  beforeEach(async () => {
    await $$.stubAuths(testOrg);
    stdoutSpy = $$.SANDBOX.stub(process.stdout, 'write');
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

    const cmd = new SObjectDescribe(['--sobjecttype', 'Account', '-u', 'testUser@test.com', '--json'], config);

    // eslint-disable-next-line no-underscore-dangle
    await cmd._run();

    const jsonOutput = JSON.parse(stripAnsi(stdoutSpy.args.flat().join('')));

    expect(jsonOutput.status).to.equal(0);
    expect(jsonOutput.result).to.deep.equal(expected);
  });

  it('logs types correctly with no errors and tooling api', async () => {
    $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
      if (isString(request) && request.includes('/services/data/v42.0/tooling/sobjects/ApexClass/describe')) {
        return Promise.resolve(expected);
      }
      return Promise.resolve({});
    };

    const cmd = new SObjectDescribe(['--sobjecttype', 'ApexClass', '-u', 'testUser@test.com', '-t', '--json'], config);

    // eslint-disable-next-line no-underscore-dangle
    await cmd._run();

    const jsonOutput = JSON.parse(stripAnsi(stdoutSpy.args.flat().join('')));

    expect(jsonOutput.status).to.equal(0);
    expect(jsonOutput.result).to.deep.equal(expected);
  });
});
