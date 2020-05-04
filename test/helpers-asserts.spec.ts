import test from 'ava';
import {comparePolygons} from './helpers/asserts';

test('comparePolygons on same single vertex', t => {
  const a = {vertices: [{_x: 0, _y: 0, _z: 0}]};
  t.true(comparePolygons(a, a));
});

test('comparePolygons on different vertices', t => {
  const a = {vertices: [{_x: 0, _y: 0, _z: 0}]};
  const b = {vertices: [{_x: 1, _y: 1, _z: 1}]};
  t.false(comparePolygons(a, b));
});

test('comparePolygons on same polygon', t => {
  const a = {
    vertices: [
      {_x: 0, _y: 0, _z: 0},
      {_x: 1, _y: 1, _z: 1},
      {_x: -1, _y: 1, _z: 1},
    ],
  };
  t.true(comparePolygons(a, a));
});

test('comparePolygons on same polygon with different vertice order', t => {
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
  t.true(comparePolygons(a, b));
});

test('comparePolygons on different polygon with same vertice', t => {
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
  t.false(comparePolygons(a, b));
});
