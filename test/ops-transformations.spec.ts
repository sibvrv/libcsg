import {CSG} from '../src/csg';
import {expect} from 'chai';

describe('CSG Objects', () => {
  it('expand() CSG objects', () => {
    const observed = CSG.cube({center: [0, 0, 0], radius: [1, 1, 1]}).expand(0.2, 8);
    // const expected = ''
    expect(observed.polygons.length).to.eq(94);
  });

  it('expand() CSG objects', () => {
    const observed = CSG.cube({center: [0, 0, 0], radius: [1, 1, 1]}).expand(0.2, 8);
    // const expected = ''
    expect(observed.polygons.length).to.eq(94);
  });
});

