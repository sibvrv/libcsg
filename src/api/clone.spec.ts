import {cube} from '../primitives';
import {clone} from './clone';
import {expect, config} from 'chai';

config.truncateThreshold = 0;

describe('Clone Test', () => {
  // TODO fix Vector2 / Vector3
  it.skip('clone', () => {
    const obs = clone(cube());
    const expFirstPoly = {
      vertices: [
        {pos: {_x: 0, _y: 0, _z: 0}, uv: {_x: 0, _y: 0}},
        {pos: {_x: 0, _y: 0, _z: 1}, uv: {_x: 0, _y: 0}},
        {pos: {_x: 0, _y: 1, _z: 1}, uv: {_x: 0, _y: 0}},
        {pos: {_x: 0, _y: 1, _z: 0}, uv: {_x: 0, _y: 0}},
      ],
      shared: {color: null},
      plane: {normal: {_x: -1, _y: -0, _z: -0}, w: -0},
    };

    const expLastPoly = {
      vertices: [
        {pos: {_x: 0, _y: 0, _z: 1}, uv: {_x: 0, _y: 0}},
        {pos: {_x: 1, _y: 0, _z: 1}, uv: {_x: 0, _y: 0}},
        {pos: {_x: 1, _y: 1, _z: 1}, uv: {_x: 0, _y: 0}},
        {pos: {_x: 0, _y: 1, _z: 1}, uv: {_x: 0, _y: 0}},
      ],
      shared: {color: null},
      plane: {normal: {_x: 0, _y: -0, _z: 1}, w: 1},
    };

    // todo fix Vector3 / Vector2
    expect(obs.properties.cube.center).to.deep.equal({_x: 0.5, _y: 0.5, _z: 0.5});
    expect(obs.polygons.length).to.eq(6);
    expect(obs.polygons[0]).to.deep.equal(expFirstPoly);
    expect(obs.polygons[obs.polygons.length - 1]).to.deep.eq(expLastPoly);
  });
});
