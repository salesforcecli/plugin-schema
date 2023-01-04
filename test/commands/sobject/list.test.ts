/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'node:os';
import * as path from 'path';
import { isString, AnyJson } from '@salesforce/ts-types';
import { TestContext, MockTestOrgData } from '@salesforce/core/lib/testSetup';
import { Config } from '@oclif/core';
import { expect } from 'chai';
import stripAnsi = require('strip-ansi');
import { SObjectList } from '../../../src/commands/sobject/list';

describe('force:schema:sobject:list', () => {
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
    const cmd = new SObjectList(['--sobjecttypecategory', 'all', '-u', 'testUser@test.com'], config);

    // eslint-disable-next-line no-underscore-dangle
    await cmd._run();

    const stdout = stdoutSpy.args.flat().join('');

    expect(stdout).includes(`customMDT${os.EOL}defaultMDT`);
  });

  it('should print the error when describeGlobal method fails', async () => {
    $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
      if (isString(request) && request.includes('/services/data/v42.0/sobjects')) {
        return Promise.reject(new Error('describeGlobal query failed'));
      }
      return Promise.resolve({});
    };
    const cmd = new SObjectList(['--sobjecttypecategory', 'all', '-u', 'testUser@test.com', '--json'], config);

    // eslint-disable-next-line no-underscore-dangle
    await cmd._run();

    const jsonOutput = JSON.parse(stripAnsi(stdoutSpy.args.flat().join('')));

    expect(jsonOutput.status).to.equal(1);
    expect(jsonOutput.message).to.equal('describeGlobal query failed');
  });

  it('should print the "noTypeFound" msg when no sobjects are found', async () => {
    $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
      if (isString(request) && request.includes('/services/data/v42.0/sobjects')) {
        return Promise.resolve({
          sobjects: [],
        });
      }
    };
    const cmd = new SObjectList(['-u', 'testUser@test.com'], config);

    // eslint-disable-next-line no-underscore-dangle
    await cmd._run();

    expect(stdoutSpy.args[1][0]).to.equal('No ALL objects found.\n');
  });
});
