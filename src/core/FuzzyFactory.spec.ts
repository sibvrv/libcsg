import {EPS} from '@core/constants';
import {FuzzyFactory} from '@core/FuzzyFactory';
import {expect} from 'chai';

describe('Core: FuzzyFactory', () => {
  it('should construct object', () => {
    const fuzzy = new FuzzyFactory(5, EPS);
    expect(fuzzy.multiplier).to.not.eq(1);
  });
});
