import CSG from '../src/core/CSG';
import {expect} from 'chai';

describe('CSG Properties', () => {
  it('CSG.Properties exists', () => {
    expect('Properties' in CSG).to.be.true;
  });
});
