import * as fs from 'fs';
import * as sinon from 'sinon';
import {getObjectPath, OBJ} from './obj-store';
import {circle} from '../../src/primitives/csg/primitives2d';
import {expect} from 'chai';

describe('OBJ store', () => {
  const TEST_CASE_SIDES_FILE = 'sides-test';
  const circleData = circle({});

  beforeEach(() => {
    sinon
      .stub(fs, 'readFileSync')
      .withArgs(getObjectPath(TEST_CASE_SIDES_FILE), 'utf8')
      .returns(JSON.stringify(circleData));
  });

  afterEach(() => {
    // restore individual methods
    (fs.readFileSync as any).restore();
  });

  it('should load sides data from file', () => {
    const result = OBJ.load(TEST_CASE_SIDES_FILE);
    expect(result).to.deep.equal(circleData);
  });
});
