import {CAG, CSG, isCAG, isCSG} from '../src/csg';
import {expect} from 'chai';

describe('Utils', () => {
  it('isCSG() is correctly determining if object is a CSG', () => {
    const emptyCSG = new CSG();
    expect(isCSG(emptyCSG)).to.be.true;
  });

  it('isCAG() is correctly determining if object is a CAG', () => {
    const emptyCAG = new CAG();
    expect(isCAG(emptyCAG)).to.be.true;
  });
});
