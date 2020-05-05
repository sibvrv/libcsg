import {comparePolygons} from './helpers/asserts';
import {expect} from 'chai';

describe('Helpers Asserts', () => {
  it('comparePolygons on same single vertex', () => {
    const a = {vertices: [{_x: 0, _y: 0, _z: 0}]};
    expect(comparePolygons(a, a)).to.be.true;
  });

  it('comparePolygons on different vertices', () => {
    const a = {vertices: [{_x: 0, _y: 0, _z: 0}]};
    const b = {vertices: [{_x: 1, _y: 1, _z: 1}]};
    expect(comparePolygons(a, b)).to.be.false;
  });

  it('comparePolygons on same polygon', () => {
    const a = {
      vertices: [
        {_x: 0, _y: 0, _z: 0},
        {_x: 1, _y: 1, _z: 1},
        {_x: -1, _y: 1, _z: 1},
      ],
    };
    expect(comparePolygons(a, a)).to.be.true;
  });

  it('comparePolygons on same polygon with different vertice order', () => {
    const a = {
      vertices: [
        {_x: 0, _y: 0, _z: 0},
        {_x: 1, _y: 1, _z: 1},
        {_x: -1, _y: 1, _z: 1},
      ],
    };
    const b = {
      vertices: [
        {_x: -1, _y: 1, _z: 1},
        {_x: 0, _y: 0, _z: 0},
        {_x: 1, _y: 1, _z: 1},
      ],
    };
    expect(comparePolygons(a, b)).to.be.true;
  });

  it('comparePolygons on different polygon with same vertice', () => {
    const a = {
      vertices: [
        {_x: 0, _y: 0, _z: 0},
        {_x: 1, _y: 1, _z: 1},
        {_x: -1, _y: 1, _z: 1},
      ],
    };
    const b = {
      vertices: [
        {_x: 0, _y: 0, _z: 0},
        {_x: -1, _y: 1, _z: 1},
        {_x: 1, _y: 1, _z: 1},
      ],
    };
    expect(comparePolygons(a, b)).to.be.false;
  });
});
