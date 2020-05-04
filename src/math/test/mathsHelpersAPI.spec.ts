import {expect} from 'chai';
import {lookup} from '../mathsHelpersAPI';

describe('Maths', () => {
  it('lookup', () => {
    const values = [
      [-200, 5],
      [-50, 20],
      [-20, 18],
      [+80, 25],
      [+150, 2]];

    const obs1 = lookup(2, values);
    const obs2 = lookup(4.2, values);
    const obs3 = lookup(20, values);

    expect(obs1).deep.eq(19.54);
    expect(obs2).deep.eq(19.694);
    expect(obs3).deep.eq(20.799999999999997);
  });
});
