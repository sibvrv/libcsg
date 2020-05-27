import {Polygon3} from '../../src/core/math';

/**
 * Compare two polygons together.
 * They are identical if they are composed with the same vertices in the same
 * relative order
 * todo: could be part of csg.js
 * todo: should simplify collinear vertices
 * @param a
 * @param b
 * @return true if both polygons are identical
 */
export function comparePolygons(a: Polygon3, b: Polygon3) {
  // First find one matching vertice
  // We try to find the first vertice of a inside b
  // If there is no such vertice, then a != b
  if (a.vertices.length !== b.vertices.length || a.vertices.length === 0) {
    return false;
  }

  const start = a.vertices[0];
  const index = b.vertices.findIndex((v: any) => {
    if (!v) {
      return false;
    }

    return v._x === start._x && v._y === start._y && v._z === start._z;
  });
  if (index === -1) {
    return false;
  }
  // Rearrange b vertices so that they start with the same vertex as a
  let vs = b.vertices;
  if (index !== 0) {
    vs = b.vertices.slice(index).concat(b.vertices.slice(0, index));
  }
  // Compare now vertices one by one
  for (let i = 0; i < a.vertices.length; i++) {
    if (a.vertices[i]._x !== vs[i]._x ||
      a.vertices[i]._y !== vs[i]._y ||
      a.vertices[i]._z !== vs[i]._z) {
      return false;
    }
  }
  return true;
}

/**
 * Assert Same Geometry
 * @param t
 * @param observed
 * @param expected
 * @param failMessage
 */
export function assertSameGeometry(t: any, observed: any, expected: any, failMessage: string = 'CSG do not have the same geometry') {
  if (!containsCSG(observed, expected) || !containsCSG(observed, expected)) {
    t.fail(failMessage);
  } else {
    t.pass();
  }
}

/**
 * a contains b if b polygons are also found in a
 * @param observed
 * @param expected
 */
export function containsCSG(observed: any, expected: any) {
  // console.log('Observed: ', observed)
  // console.log('Expected: ', expected)

  return observed.toPolygons().map((p: any) => {
    let found = false;
    const bp = expected.toPolygons();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < bp.length; i++) {
      if (comparePolygons(p, bp[i])) {
        found = true;
        break;
      }
    }
    return found;
  }).reduce((_observed: any, _expected: any) => _observed && _expected);
}

/**
 * Simplified Polygon
 * @param polygon
 */
export function simplifiedPolygon(polygon: Polygon3) {
  const vertices = polygon.vertices.map((vertex: any) => [vertex.pos._x, vertex.pos._y, vertex.pos._z]);
  const plane = {normal: [polygon.plane.normal._x, polygon.plane.normal._y, polygon.plane.normal._z], w: polygon.plane.w};
  return {positions: vertices, plane, shared: polygon.shared};
}

/**
 *
 * @param cag
 */
export function simplifieSides(cag: any) {
  const sides = cag.sides.map((side: any) => [side.vertex0.pos._x, side.vertex0.pos._y, side.vertex1.pos._x, side.vertex1.pos._y]);
  return sides.sort();
}

/**
 *
 * @param a
 * @param b
 * @param epsilon
 */
export function nearlyEquals(a: any, b: any, epsilon = 1) {
  if (a === b) { // shortcut, also handles infinities and NaNs
    return true;
  }

  const absA = Math.abs(a);
  const absB = Math.abs(b);
  const diff = Math.abs(a - b);
  if (a === 0 || b === 0 || diff < Number.EPSILON) {
    // a or b is zero or both are extremely close to it
    // relative error is less meaningful here
    if (diff > (epsilon * Number.EPSILON)) {
      return false;
    }
  }
  // use relative error
  if ((diff / Math.min((absA + absB), Number.MAX_VALUE)) > epsilon) {
    return false;
  }
  return true;
}

/**
 * CAG Nearly Equals
 * @param observed
 * @param expected
 * @param precision
 * @constructor
 */
export function CAGNearlyEquals(observed: any, expected: any, precision?: any) {
  if (observed.sides.length !== expected.sides.length) {
    return false;
  }
  if (observed.isCanonicalized !== expected.isCanonicalized) {
    return false;
  }
  const obsSides = simplifieSides(observed);
  const expSides = simplifieSides(expected);

  for (let i = 0; i < obsSides.length; i++) {
    for (let j = 0; j < obsSides[i].length; j++) {
      if (!nearlyEquals(obsSides[i][j], expSides[i][j], precision)) {
        return false;
      }
    }
  }

  return true;
}
