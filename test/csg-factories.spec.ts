import test from 'ava';

import {Polygon3, Vector3, Vertex3} from '../src/core/math';
import {fromObject, fromPolygons} from '../src/core/CSGFactories';

test('CSG can be created from polygons', t => {
  const vertices = [
    new Vertex3(new Vector3([0, 0, 0])),
    new Vertex3(new Vector3([0, 10, 0])),
    new Vertex3(new Vector3([0, 10, 10])),
  ];
  const polygons = new Polygon3(vertices);
  const obsCSG = fromPolygons(polygons);
  t.deepEqual(obsCSG.polygons, polygons);
});

test('CSG can be created from objects', t => {
  const input = {
    polygons: [{
      vertices: [
        {pos: {x: 0, y: 0, z: 0}},
        {pos: {x: 0, y: 10, z: 0}},
        {pos: {x: 0, y: 10, z: 10}},
      ],
      shared: {
        color: [1, 0, 1, 1],
      },
      plane: {
        normal: [10, 1, 1],
        w: 1,
      },
    },
    ],
  };
  const obsCSG = fromObject(input);
  t.deepEqual(obsCSG.polygons.length, 1);
});
