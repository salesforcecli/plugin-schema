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
import path from 'node:path';
import { strict as assert } from 'node:assert';
import { expect } from 'chai';
import type { DescribeSObjectResult } from '@jsforce/jsforce-node';
import { TestSession, execCmd } from '@salesforce/cli-plugins-testkit';
import { SObjectListResult } from '../src/commands/sobject/list.js';

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
