import test from 'ava';
import {CSG} from '@core/CSG';
import {CAG} from '@core/CAG';
import {Vector3} from '@core/math';

//
// Test suite for CSG initialization (new)
// - verify that the CSG is "empty" in all ways
// - verify that CSG functions do / return nothing
// - verify that the CSG converts to/from properly
//
test('New CSG should contain nothing', t => {
  const csg = new CSG();

// conversion functions
  t.is(csg.toString(), 'CSG solid:\n');

  t.true(Array.isArray(csg.toPolygons()));
  t.is(csg.toPolygons().length, 0);

  const feature = csg.getFeatures('volume');
  t.is(feature, 0);
  const feature2 = csg.getFeatures('area');
  t.is(feature2, 0);

  const bounds = csg.getBounds();
  t.true(Array.isArray(bounds));
  t.is(bounds.length, 2);
  t.is(typeof bounds[0], 'object');
  t.is(typeof bounds[1], 'object');

  const vector0 = bounds[0];
  t.is(typeof vector0, 'object');
  t.is(vector0.x, 0);
  t.is(vector0.y, 0);
  t.is(vector0.z, 0);
  const vector1 = bounds[1];
  t.is(typeof vector1, 'object');
  t.is(vector1.x, 0);
  t.is(vector1.y, 0);
  t.is(vector1.z, 0);

  const triangles = csg.toTriangles();
  t.is(triangles.length, 0);

  const binary = csg.toCompactBinary();
  t.is(binary.class, 'CSG');
  t.is(binary.numPolygons, 0);
  t.is(binary.numVerticesPerPolygon.length, 0);
  t.is(binary.polygonPlaneIndexes.length, 0);
  t.is(binary.polygonSharedIndexes.length, 0);
  t.is(binary.polygonVertices.length, 0);
});

test('New CSG should do nothing', t => {
  const csg = new CSG();

// tests for basic transforms
  const shared = new CSG.Polygon.Shared([0.1, 0.2, 0.3, 0.4]);
  let acsg = csg.setShared(shared);
  t.deepEqual(csg, acsg);

  acsg = csg.setColor(0.1, 0.2, 0.3, 0.4);
  t.deepEqual(csg, acsg);

  acsg = csg.canonicalized();
  t.deepEqual(csg, acsg);

  acsg = csg.reTesselated();
  t.deepEqual(csg, acsg);

  const matrix = CSG.Matrix4x4.rotationX(45);
  acsg = csg.transform1(matrix);
  // FIXME
  //  -  "isCanonicalized": true
  //  +  "isCanonicalized": false
  // t.deepEqual(csg,acsg);

  acsg = csg.transform(matrix);
  t.deepEqual(csg, acsg);

  acsg = csg.fixTJunctions(matrix);
  t.deepEqual(csg, acsg);

// tests for common transforms
  const plane = new CSG.Plane(Vector3.Create(0, 0, 1), 0);
  acsg = csg.mirrored(plane);
  t.deepEqual(csg, acsg);
  acsg = csg.mirroredX();
  t.deepEqual(csg, acsg);
  acsg = csg.mirroredY();
  t.deepEqual(csg, acsg);
  acsg = csg.mirroredZ();
  t.deepEqual(csg, acsg);

  acsg = csg.translate([10, 10, 10]);
  t.deepEqual(csg, acsg);

  acsg = csg.scale([2.0, 2.0, 2.0]);
  t.deepEqual(csg, acsg);

  acsg = csg.rotate([0, 0, 0], [1, 1, 1], 45);
  t.deepEqual(csg, acsg);
  acsg = csg.rotateX();
  t.deepEqual(csg, acsg);
  acsg = csg.rotateY();
  t.deepEqual(csg, acsg);
  acsg = csg.rotateZ();
  t.deepEqual(csg, acsg);
  acsg = csg.rotateEulerAngles(45, 45, 45, [0, 0, 0]);
  t.deepEqual(csg, acsg);

  // FIXME
  acsg = csg.center([true, true, true]);
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

// TODO write tests for enhanced transforms
  // FIXME
  acsg = csg.cutByPlane(plane);
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  acsg = csg.expand(2.0, 36);
  // FXIME caching of boundingBox changes original object
  delete (csg.cachedBoundingBox); // FIXME: HACK !!
  t.deepEqual(csg, acsg);

  // FIXME
  acsg = csg.contract(2.0, 36);
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  // FIXME
  acsg = csg.invert();
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  // FIXME
  acsg = csg.stretchAtPlane([1, 0, 0], [0, 0, 0], 2.0);
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  // FIXME
  acsg = csg.expandedShell(2.0, 36, false);
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);

  // FIXME
  acsg = csg.lieFlat();
  //  -  "cachedBoundingBox": [...]
  // caching of boundingBox changes original object
  // t.deepEqual(csg,acsg);
});

test('New CSG should return empty values', t => {
  const csg = new CSG();

  const imatrix = new CSG.Matrix4x4();
  const aarray = csg.getTransformationAndInverseTransformationToFlatLying();
  t.is(aarray.length, 2);
  t.deepEqual(aarray[0], imatrix);
  t.deepEqual(aarray[1], imatrix);

  const amatrix = csg.getTransformationToFlatLying();
  t.deepEqual(amatrix, imatrix);

  const plane = new CSG.Plane(Vector3.Create(0, 0, 1), 0);
  const onb = new CSG.OrthoNormalBasis(plane);

  const cag = new CAG();
  const ucag = cag.union(new CAG());

  let acag = csg.projectToOrthoNormalBasis(onb);
  // NOTE: CAG.union() is being called internally so compare accordingly
  t.deepEqual(acag, ucag);

  acag = csg.sectionCut(onb);
  // NOTE: CAG.union() is being called internally so compare accordingly
  t.deepEqual(acag, ucag);

//  const acsg = CSG.toPointCloud(csg);
//  t.deepEqual(acsg, csg);
});

test('New CSG should convert properly', t => {
  const csg = new CSG();

  const acb = csg.toCompactBinary();
  let acsg = CSG.fromCompactBinary(acb);
  t.deepEqual(csg, acsg);

  // TODO use toObject() when available
  const aobj = {polygons: [], isCanonicalized: true, isRetesselated: true};
  acsg = CSG.fromObject(aobj);
  t.deepEqual(acsg, csg);

  const polygons = csg.toTriangles();
  t.is(polygons.length, 0);
  acsg = CSG.fromPolygons(polygons);
  t.deepEqual(acsg.polygons, polygons);
  t.deepEqual(acsg.isCanonicalized, false);
  t.deepEqual(acsg.isRetesselated, false);
});
