export function vertex3Equals(t: any, observed: any, expected: any) {
  const obs = [observed.pos._x, observed.pos._y, observed.pos._z];
  return t.deepEqual(obs, expected);
}

export function vertex2Equals(t: any, observed: any, expected: any, failMessage?: string) {
  const obs = [observed.pos._x, observed.pos._y];
  return t.deepEqual(obs, expected);
}

export function vector3Equals(t: any, observed: any, expected: any) {
  const obs = [observed._x, observed._y, observed._z];
  return t.deepEqual(obs, expected);
}

export function sideEquals(t: any, observed: any, expected: any) {
  vertex2Equals(t, observed.vertex0, expected[0], 'vertex0 are not equal');
  vertex2Equals(t, observed.vertex1, expected[1], 'vertex1 are not equal');
}

export function shape2dToNestedArray(shape2d: any) {
  const sides = shape2d.sides.map((side: any) => {
    return [side.vertex0.pos._x, side.vertex0.pos._y, side.vertex1.pos._x, side.vertex1.pos._y];
  });
  return sides;
}

export function shape3dToNestedArray(shape3d: any) {
  const polygons = shape3d.polygons.map((polygon: any) => {
    return polygon.vertices.map((vertex: any) => [vertex.pos._x, vertex.pos._y, vertex.pos._z]);
  });
  return polygons;
}

export function simplifiedPolygon(polygon: any) {
  const vertices = polygon.vertices.map((vertex: any) => [vertex.pos._x, vertex.pos._y, vertex.pos._z]);
  const plane = {normal: [polygon.plane.normal._x, polygon.plane.normal._y, polygon.plane.normal._z], w: polygon.plane.w};
  return {positions: vertices, plane, shared: polygon.shared};
}

export function simplifiedCSG(csg: any) {
  const polygonsData = csg.polygons.map((x: any) => simplifiedPolygon(x).positions);
  return polygonsData;
}

export function almostEquals(t: any, observed: any, expected: any, precision: any) {
  t.is(Math.abs(expected - observed) < precision, true);
}

export function compareNumbers(a: any, b: any, precision: any) {
  return Math.abs(a - b) < precision;
}

export function compareVertices(a: any, b: any, precision: any) {
  if ('_w' in a && !('_w' in b)) {
    return false;
  }
  const fields = ['_x', '_y', '_z'];

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (!compareNumbers(a[field], b[field], precision)) {
      return false;
    }
  }
  return true;
}

export function comparePolygons(a: any, b: any, precision: any) {
  // First find one matching vertice
  // We try to find the first vertice of a inside b
  // If there is no such vertice, then a != b
  if (a.vertices.length !== b.vertices.length || a.vertices.length === 0) {
    return false;
  }
  if (a.shared.color && a.shared.color !== b.shared.color) {
    return false;
  }
  if (a.shared.tag && a.shared.tag !== b.shared.tag) {
    return false;
  }
  if (a.shared.plane && a.shared.plane !== b.shared.plane) {
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
    const vertex = a.vertices[i].pos;
    const otherVertex = vs[i].pos;
    if (!compareVertices(vertex, otherVertex, precision)) {
      return false;
    }
    /* if (a.vertices[i]._x !== vs[i]._x ||
            a.vertices[i]._y !== vs[i]._y ||
            a.vertices[i]._z !== vs[i]._z) { return false } */
  }
  return true;
}
