import test from 'ava';
import CAG from '../src/core/CAG';
import {clearTags} from './helpers/clearTags';

//
// Test suite for CAG Conversions
//

test('CAG should convert to and from binary', t => {
  // test using simple default shapes
  // In the current form this test cannot be working, something comparing
  // sides one by one should be written as objects differs

  const c1 = CAG.circle();
  const c2 = CAG.ellipse();
  const c3 = CAG.rectangle();
  const c4 = CAG.roundedRectangle();

  const b1 = c1.toCompactBinary();
  const r1 = CAG.fromCompactBinary(b1);
  t.deepEqual(clearTags(c1), r1);
  const b2 = c2.toCompactBinary();
  const r2 = CAG.fromCompactBinary(b2);
  t.deepEqual(clearTags(c2), r2);
  const b3 = c3.toCompactBinary();
  const r3 = CAG.fromCompactBinary(b3);
  t.deepEqual(clearTags(c3), r3);
  const b4 = c4.toCompactBinary();
  const r4 = CAG.fromCompactBinary(b4);
  t.deepEqual(clearTags(c4), r4);
});

test('CAG should convert to and from anonymous object', t => {
  // test using simple default shapes
  const c1 = CAG.circle();
  const c2 = CAG.ellipse();
  const c3 = CAG.rectangle();
  const c4 = CAG.roundedRectangle();

  const b1 = JSON.parse(JSON.stringify(c1));
  const r1 = CAG.fromObject(b1);
  t.deepEqual(c1, r1);
  const b2 = JSON.parse(JSON.stringify(c2));
  const r2 = CAG.fromObject(b2);
  t.deepEqual(c2, r2);
  const b3 = JSON.parse(JSON.stringify(c3));
  const r3 = CAG.fromObject(b3);
  t.deepEqual(c3, r3);
  const b4 = JSON.parse(JSON.stringify(c4));
  const r4 = CAG.fromObject(b4);
  t.deepEqual(c4, r4);
});

test('CAG should convert to and from sides', t => {
  // test using simple default shapes
  const c1 = CAG.circle();
  const c2 = CAG.ellipse();
  const c3 = CAG.rectangle();
  const c4 = CAG.roundedRectangle();

  const s1 = c1.sides;
  const f1 = CAG.fromSides(s1).canonicalized();
  t.deepEqual(c1, f1);
  const s2 = c2.sides;
  const f2 = CAG.fromSides(s2).canonicalized();
  t.deepEqual(c2, f2);
  const s3 = c3.sides;
  const f3 = CAG.fromSides(s3).canonicalized();
  t.deepEqual(c3, f3);
  const s4 = c4.sides;
  const f4 = CAG.fromSides(s4).canonicalized();
  t.deepEqual(c4, f4);
});

test('CAG should convert to and from points', t => {
  // test using simple default shapes
  const c1 = CAG.circle();
  const c2 = CAG.ellipse();
  const c3 = CAG.rectangle();
  const c4 = CAG.roundedRectangle();

  const pts1 = c1.toPoints();
  const pts2 = c2.toPoints();
  const pts3 = c3.toPoints();
  const pts4 = c4.toPoints();

  let v1 = CAG.fromPoints(pts1);
  t.deepEqual(c1, v1);
  v1 = CAG.fromPointsNoCheck(pts1);
  t.deepEqual(c1.toPoints(), v1.toPoints());
  let v2 = CAG.fromPoints(pts2);
  t.deepEqual(c2, v2);
  v2 = CAG.fromPointsNoCheck(pts2);
  t.deepEqual(c2.toPoints(), v2.toPoints());
  let v3 = CAG.fromPoints(pts3);
  t.deepEqual(c3, v3);
  v3 = CAG.fromPointsNoCheck(pts3);
  t.deepEqual(c3.toPoints(), v3.toPoints());
  // Order of points is wrong, see Issue #35
  // var v4 = CAG.fromPoints(pts4)
  // t.deepEqual(c4, v4)
});

test('CAG should convert to and from paths', t => {
  // fails because of https://github.com/jscad/csg.js/issues/15

  // test using simple default shapes
  const c1 = CAG.circle();
  const c2 = CAG.ellipse();
  const c3 = CAG.rectangle();
  const c4 = CAG.roundedRectangle();

  // convert to array of CSG.Path2D
  const s1 = c1.getOutlinePaths();
  const p1 = s1[0]; // use first path from list of paths
  const f1 = CAG.fromPath2(p1);
  t.deepEqual(c1.toPoints(), f1.toPoints());
  const s2 = c2.getOutlinePaths();
  const p2 = s2[0]; // use first path from list of paths
  const f2 = CAG.fromPath2(p2);
  t.deepEqual(c2.toPoints(), f2.toPoints());
  const s3 = c3.getOutlinePaths();
  const p3 = s3[0]; // use first path from list of paths
  const f3 = CAG.fromPath2(p3);
  t.deepEqual(c3.toPoints(), f3.toPoints());
  const s4 = c4.getOutlinePaths();
  const p4 = s4[0]; // use first path from list of paths
  const f4 = CAG.fromPath2(p4);
  // Order of points is wrong, see Issue #35
  // t.deepEqual(c4.toPoints(), f4.toPoints())
});
