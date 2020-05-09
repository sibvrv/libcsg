import test from 'ava';
import {CAG, CSG} from '../src/csg';
import {Matrix4x4} from '../src/core/math';

//
// Test suite for CAG initialization (new)
// - verify that the CAG is "empty" in all ways
// - verify that CAG functions do / return nothing
// - verify that the CAG converts to/from properly
//
test('New CAG should contain nothing', t => {
  const cag = new CAG();

// conversion functions
  t.is(cag.toString(), 'CAG (0 sides):\n');
  t.is(cag.isSelfIntersecting(), false);

  const area = cag.area();
  t.is(area, 0);

  const bounds = cag.getBounds();
  t.true(Array.isArray(bounds));
  t.is(bounds.length, 2);
  t.is(typeof bounds[0], 'object');
  t.is(typeof bounds[1], 'object');

  const vector0 = bounds[0];
  t.is(typeof vector0, 'object');
  t.is(vector0.x, 0);
  t.is(vector0.y, 0);
  const vector1 = bounds[1];
  t.is(typeof vector1, 'object');
  t.is(vector1.x, 0);
  t.is(vector1.y, 0);
});

test('New CAG should do nothing', t => {
  const cag = new CAG();

  // t.deepEqual(cag.canonicalized(), cag)

// test for basic transforms
  const cagB = CAG.rectangle();

  const cag1 = cag.union(cagB);
  t.deepEqual(cag1, cagB);
  const cag2 = cag.subtract(cagB);
  // FIXME : t.deepEqual(cag2,cag);
  const cag3 = cag.intersect(cagB);
  // FIXME : t.deepEqual(cag3,cag);

// tests for basic functionality
  const matrixB = Matrix4x4.translation([10, 10, 0]);
  const cag4 = cag.transform(matrixB);
  t.deepEqual(cag4, cag);
  const cag5 = cag.flipped();
  t.deepEqual(cag5, cag);
});

test('New CAG should return empty values', t => {
  const cag = new CAG().canonicalized();

// test internals
  const csg1 = cag._toCSGWall(0, 0);
  const csg2 = new CSG();
  // FIXME : t.deepEqual(csg1,csg2);

  const matrixB = CSG.Matrix4x4.translation([10, 10, 0]);
  const pairs3D = cag._toVector3DPairs(matrixB);
  t.true(Array.isArray(pairs3D));
  t.is(pairs3D.length, 0);

  const polys3D = cag._toPlanePolygons({}); // use defaults
  t.true(Array.isArray(polys3D));
  // FIXME : t.is(polys3D.length, 0);

  // var connector1 = new CSG.Connector(offsetVector.times(i / twiststeps), [0, 0, 1],
  //                normalVector.rotateZ(i * twistangle/twiststeps));
  // var connector2 = new CSG.Connector(offsetVector.times(i / twiststeps), [0, 0, 1],
  //                normalVector.rotateZ(i * twistangle/twiststeps));
  // var polys3D = cag._toWallPolygons({toConnector1: connector1, toConnector2: connector2});

// test externals
  const paths = cag.getOutlinePaths();
  t.true(Array.isArray(paths));
  t.is(paths.length, 0);

  const cagC = cag.overCutInsideCorners();
  t.deepEqual(cag, cagC);

  const cag1 = cag.expandedShell(4, 8);
  t.deepEqual(cag, cag1);
  const cag2 = cag.expand(4, 8);
  t.deepEqual(cag, cag2);
  const cag3 = cag.contract(4, 8);
  t.deepEqual(cag, cag3);
});

test('New CAG should convert properly', t => {
  const cag = new CAG();

// to from binary
  const binary = cag.toCompactBinary();
  t.is(binary.class, 'CAG');
  t.is(binary.sideVertexIndices.length, 0);
  t.is(binary.vertexData.length, 0);

// to 3D objects
  const csgNew = new CSG();
  const csg1 = cag.extrude(); // use defaults
  t.deepEqual(csg1, csgNew);
  const csg2 = cag.extrudeInPlane('X', 'Y', 1.0, {symmetrical: true});
  t.deepEqual(csg2, csgNew);
  const ortho1 = CSG.OrthoNormalBasis.GetCartesian('-X', '-Y');
  const csg3 = cag.extrudeInOrthonormalBasis(ortho1);
  t.deepEqual(csg3, csgNew);

  const csg4 = cag.rotateExtrude();
  // FIXME : t.deepEqual(csg4,csgNew);
});
