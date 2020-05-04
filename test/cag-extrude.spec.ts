import test from 'ava';
import {CAG, CSG} from '../src/csg';

//
// Test suite for CAG Extrude Functions
//
test('CAG should extrude', t => {
  // test using simple default shapes
  const c1 = CAG.circle();
  const c2 = CAG.ellipse();
  const c3 = CAG.rectangle();
  const c4 = CAG.roundedRectangle();

  let s1 = c1.extrude(); // default options
  t.is(s1.toPolygons().length, 66);
  const s2 = c2.extrude(); // default options
  t.is(s2.toPolygons().length, 70);
  let s3 = c3.extrude(); // default options
  t.is(s3.toPolygons().length, 10);
  let s4 = c4.extrude(); // default options
  t.is(s4.toPolygons().length, 74);

  s1 = c1.extrude({offset: [5, 5, 5]});
  t.is(s1.toPolygons().length, 66);
  s1 = c1.extrude({offset: [0, 0, 10], twistangle: 15, twiststeps: 5});
  t.is(s1.toPolygons().length, 322);
  s3 = c3.extrude({offset: [50, 0, 100], twistangle: 45, twiststeps: 10});
  t.is(s3.toPolygons().length, 82);
  s4 = c4.extrude({offset: [0, 10, -100], twistangle: 5, twiststeps: 100});
  t.is(s4.toPolygons().length, 7202);

  /*
  return  linear_extrude({height: 1, slices: 2 },
           translate([2,0,0], circle({r: 1, fn: 8}))
        )
*/
});

test('CAG should extrudeInPlane', t => {
  // test using simple default shapes
  const c1 = CAG.circle();
  const c2 = CAG.ellipse();
  const c3 = CAG.rectangle();
  const c4 = CAG.roundedRectangle();

  const s1 = c1.extrudeInPlane('X', 'Z', 5);
  t.is(s1.toPolygons().length, 66);
  const s2 = c2.extrudeInPlane('-X', 'Z', 10, {symmetrical: true});
  t.is(s2.toPolygons().length, 70);
  const s3 = c3.extrudeInPlane('-Y', '-Z', 100, {symmetrical: 'false'});
  t.is(s3.toPolygons().length, 10);
  const s4 = c4.extrudeInPlane('Y', '-Z', 20, {symmetrical: 'true'});
  t.is(s4.toPolygons().length, 74);
});

test('CAG should extrudeInOrthonormalBasis', t => {
  // test using simple default shapes
  const c1 = CAG.circle();
  const c2 = CAG.ellipse();
  const c3 = CAG.rectangle();
  const c4 = CAG.roundedRectangle();

  const xy = CSG.OrthoNormalBasis.GetCartesian('X', 'Y');
  const zy = CSG.OrthoNormalBasis.GetCartesian('Z', 'Y');
  const xz = CSG.OrthoNormalBasis.GetCartesian('X', 'Z');
  const mm = CSG.OrthoNormalBasis.GetCartesian('-X', '-Z');

  const s1 = c1.extrudeInOrthonormalBasis(xy, 5);
  t.is(s1.toPolygons().length, 66);
  const s2 = c2.extrudeInOrthonormalBasis(zy, 5, {symmetrical: true});
  t.is(s2.toPolygons().length, 70);
  const s3 = c3.extrudeInOrthonormalBasis(zy, 5, {symmetrical: false});
  t.is(s3.toPolygons().length, 10);
  const s4 = c4.extrudeInOrthonormalBasis(mm, 100, {symmetrical: true});
  t.is(s4.toPolygons().length, 74);
});
