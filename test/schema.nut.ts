/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as path from 'path';
import { strict as assert } from 'node:assert';
import { expect } from 'chai';
import { DescribeSObjectResult } from 'jsforce';
import { TestSession, execCmd } from '@salesforce/cli-plugins-testkit';
import { SObjectListResult } from '../src/commands/sobject/list';

let session: TestSession;

describe('verifies all commands run successfully ', () => {
  let allObjects: string[];
  const objectDescribeKeys = [
    'actionOverrides',
    'activateable',
    'childRelationships',
    'custom',
    'customSetting',
    'fields',
    'hasSubtypes',
    'keyPrefix',
    'label',
    'labelPlural',
    'name',
    'queryable',
    'recordTypeInfos',
    'retrieveable',
    'searchable',
    'urls',
    'triggerable',
    'undeletable',
    'updateable',
  ];

  before(async () => {
    // validate that we can auth to a hub from env
    if (!process.env.TESTKIT_ORG_USERNAME && !process.env.TESTKIT_HUB_USERNAME && !process.env.TESTKIT_AUTH_URL) {
      throw new Error('Set environment variables so testkit can auth to a hub');
    }
    session = await TestSession.create({
      project: {
        name: 'testProject',
      },
      devhubAuthStrategy: 'AUTO',
      scratchOrgs: [
        {
          setDefault: true,
          config: path.join('config', 'project-scratch-def.json'),
        },
      ],
    });
  });

  after(async () => {
    await session?.zip(undefined, 'artifacts');
    await session?.clean();
  });

  describe('list command', () => {
    it('requests all objects by default', () => {
      const result = execCmd<SObjectListResult>('force:schema:sobject:list --json', { ensureExitCode: 0 }).jsonOutput
        ?.result;
      assert(result?.length);
      expect(result).to.have.length.greaterThan(1);
      allObjects = result;
    });

    it('requests all objects explicity', () => {
      const result = execCmd<SObjectListResult>('force:schema:sobject:list --json --sobjecttypecategory ALL', {
        ensureExitCode: 0,
      }).jsonOutput?.result;
      assert(result);
      expect(result).to.have.length(allObjects.length);
      allObjects = result;
    });

    it('requests standard objects', () => {
      const result = execCmd<SObjectListResult>('force:schema:sobject:list --json --sobjecttypecategory STANDARD', {
        ensureExitCode: 0,
      }).jsonOutput?.result;
      // all the objects are standard in a vanilla scratch org
      expect(result).to.have.length(allObjects.length);
    });

    it('requests custom objects but finds none in vanilla scratch org', () => {
      const result = execCmd<SObjectListResult>('force:schema:sobject:list --json --sobjecttypecategory CUSTOM', {
        ensureExitCode: 0,
      }).jsonOutput?.result;
      expect(result).to.have.length(0);
    });

    it('no errors on non-json commands', () => {
      execCmd('force:schema:sobject:list', { ensureExitCode: 0 });
      execCmd('force:schema:sobject:list --sobjecttypecategory STANDARD', { ensureExitCode: 0 });
      execCmd('force:schema:sobject:list --sobjecttypecategory ALL', { ensureExitCode: 0 });
      execCmd('force:schema:sobject:list --sobjecttypecategory CUSTOM', { ensureExitCode: 0 });
    });
  });

  describe('describe command', () => {
    it('describes Account', () => {
      const output = execCmd<DescribeSObjectResult>('force:schema:sobject:describe --sobjecttype Account --json', {
        ensureExitCode: 0,
      }).jsonOutput;
      expect(output?.result).to.include.keys(objectDescribeKeys);
    });

    it('describes ApexClass via toolingApi', () => {
      const output = execCmd<DescribeSObjectResult>('force:schema:sobject:describe --sobjecttype ApexClass -t --json', {
        ensureExitCode: 0,
      }).jsonOutput;
      expect(output?.result).to.include.keys(objectDescribeKeys);
    });

    it('no errors on non-json commands', () => {
      execCmd('force:schema:sobject:describe --sobjecttype Account', { ensureExitCode: 0 });
      execCmd('force:schema:sobject:describe --sobjecttype ApexClass -t', { ensureExitCode: 0 });
    });
  });
});
