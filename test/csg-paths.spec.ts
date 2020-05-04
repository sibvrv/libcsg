import test from 'ava';
import {CSG} from '../src/csg';
import {OBJ} from './helpers/obj-store';
import {assertSameGeometry} from './helpers/asserts';

// Testing common shape generation can only be done by comparing
// with previously human validated shapes. It would be trivially
// rewriting the generation code to test it with code instead.

function isValid(t: any, name: string, observed: any) {
  const expected = OBJ.loadPrevious('csg-shapes.' + name, observed);
  assertSameGeometry(t, observed, expected);
}

test('CSG.Path2D constructor creates an empty path', t => {
  const p1 = new CSG.Path2D();

  t.is(typeof p1, 'object');
  t.false(p1.isClosed());
  t.is(p1.getPoints().length, 0);

// make sure methods work on empty paths
  const p2 = new CSG.Path2D();
  let p3 = p1.concat(p2);

  t.false(p3.isClosed());
  t.is(p3.getPoints().length, 0);

  const matrix = CSG.Matrix4x4.rotationX(90);
  p3 = p2.transform(matrix);

  t.false(p3.isClosed());
  t.is(p3.getPoints().length, 0);

  p3 = p2.appendPoint([1, 1]);

  t.false(p3.isClosed());
  t.is(p3.getPoints().length, 1);
  t.false(p2.isClosed());
  t.is(p2.getPoints().length, 0);

  p3 = p2.appendPoints(p1.getPoints());

  t.false(p3.isClosed());
  t.is(p3.getPoints().length, 0);

// test that close is possible
  const p4 = p3.close();

  t.true(p4.isClosed());
  t.is(p4.getPoints().length, 0);

});

test('CSG.Path2D.arc() creates correct paths', t => {
// test default options
  const a1 = CSG.Path2D.arc();
  const p1 = a1.getPoints();

  t.false(a1.isClosed());
  t.is(p1.length, 34);
  t.deepEqual(p1[0], new CSG.Vector2D([1, 0]));

// test center
  const a2 = CSG.Path2D.arc({center: [5, 5]});
  const p2 = a2.getPoints();

  t.false(a2.isClosed());
  t.is(p2.length, 34);
  t.deepEqual(p2[0], new CSG.Vector2D([6, 5]));

// test radius (with center)
  const a3 = CSG.Path2D.arc({center: [5, 5], radius: 10});
  const p3 = a3.getPoints();

  t.false(a3.isClosed());
  t.is(p3.length, 34);
  t.deepEqual(p3[0], new CSG.Vector2D([15, 5]));

// test start angle (with radius)
  const a4 = CSG.Path2D.arc({radius: 10, startangle: 180});
  const p4 = a4.getPoints();

  t.false(a4.isClosed());
  t.is(p4.length, 18);
  // t.deepEqual(p4[0],new CSG.Vector2D([10,0]))

// test end angle (with center)
  const a5 = CSG.Path2D.arc({center: [5, 5], endangle: 90});
  const p5 = a5.getPoints();

  t.false(a5.isClosed());
  t.is(p5.length, 10);
  t.deepEqual(p5[0], new CSG.Vector2D([6, 5]));

// test resolution (with radius)
  const a6 = CSG.Path2D.arc({radius: 10, resolution: 144});
  const p6 = a6.getPoints();

  t.false(a6.isClosed());
  t.is(p6.length, 146);
  t.deepEqual(p6[0], new CSG.Vector2D([10, 0]));

// test make tangent (with radius)
  const a7 = CSG.Path2D.arc({radius: 10, maketangent: true});
  const p7 = a7.getPoints();

  t.false(a7.isClosed());
  t.is(p7.length, 36);
  t.deepEqual(p7[0], new CSG.Vector2D([10, 0]));
});

test('CSG.Path2D creates CAG from paths', t => {
  let p1 = new CSG.Path2D([[27.5, -22.96875]], false);
  p1 = p1.appendPoint([27.5, -3.28125]);
  p1 = p1.appendArc([12.5, -22.96875], {xradius: 15, yradius: -19.6875, xaxisrotation: 0, clockwise: false, large: false});
  p1 = p1.close();

  const cag01 = p1.innerToCAG();
  t.is(typeof cag01, 'object');

  let p2 = new CSG.Path2D([[27.5, -22.96875]], false);
  p2 = p2.appendPoint([27.5, -3.28125]);
  p2 = p2.appendArc([12.5, -22.96875], {xradius: 15, yradius: -19.6875, xaxisrotation: 0, clockwise: false, large: true});
  p2 = p2.close();

  const cag02 = p2.innerToCAG();
  t.is(typeof cag02, 'object');

  let p3 = new CSG.Path2D([[27.5, -22.96875]], false);
  p3 = p3.appendPoint([27.5, -3.28125]);
  p3 = p3.appendArc([12.5, -22.96875], {xradius: 15, yradius: -19.6875, xaxisrotation: 0, clockwise: true, large: true});
  p3 = p3.close();

  const cag03 = p3.innerToCAG();
  t.is(typeof cag03, 'object');

  let p4 = new CSG.Path2D([[27.5, -22.96875]], false);
  p4 = p4.appendPoint([27.5, -3.28125]);
  p4 = p4.appendArc([12.5, -22.96875], {xradius: 15, yradius: -19.6875, xaxisrotation: 0, clockwise: true, large: false});
  p4 = p4.close();

  const cag04 = p4.innerToCAG();
  t.is(typeof cag04, 'object');

  let p5 = new CSG.Path2D([[10, -20]], false);
  p5 = p5.appendBezier([[10, -10], [25, -10], [25, -20]]);
  p5 = p5.appendBezier([[25, -30], [40, -30], [40, -20]]);

  const cag05 = p5.expandToCAG(0.05, CSG.defaultResolution2D);
  t.is(typeof cag05, 'object');
});

test('CSG.Path2D closed cw square turns cw', t => {
  const path = new CSG.Path2D([[0, 0]], false).appendPoint([1, 0]).appendPoint([1, 1]).appendPoint([0, 1]).close();
  t.deepEqual(path.getTurn(), 'clockwise');
});

test('CSG.Path2D unclosed cw triangle turns cw', t => {
  const path = new CSG.Path2D([[0, 0]], false).appendPoint([1, 0]).appendPoint([0, 1]);
  t.deepEqual(path.getTurn(), 'clockwise');
});

test('CSG.Path2D closed ccw square is ccw', t => {
  const path = new CSG.Path2D([[0, 0]], false).appendPoint([0, 1]).appendPoint([1, 1]).appendPoint([1, 0]).close();
  t.deepEqual(path.getTurn(), 'counter-clockwise');
});

test('CSG.Path2D unit straight path area is straight', t => {
  const path = new CSG.Path2D([[0, 0]], false).appendPoint([0, 1]);
  t.deepEqual(path.getTurn(), 'straight');
});
