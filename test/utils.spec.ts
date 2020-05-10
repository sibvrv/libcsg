import {CSG} from '@core/CSG';
import {CAG} from '@core/CAG';
import {expect} from 'chai';
import {isCSG} from '@core/utils/isCSG';
import {isCAG} from '@core/utils/isCAG';

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
