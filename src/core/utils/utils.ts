export const solve2Linear = (a: number, b: number, c: number, d: number, u: number, v: number): [number, number] => {
  const det = a * d - b * c;
  const invdet = 1.0 / det;
  let x = u * d - b * v;
  let y = -u * c + a * v;
  x *= invdet;
  y *= invdet;
  return [x, y];
};

export function insertSorted(array: any[], element: any, comparefunc: any) {
  let leftbound = 0;
  let rightbound = array.length;
  while (rightbound > leftbound) {
    const testindex = Math.floor((leftbound + rightbound) / 2);
    const testelement = array[testindex];
    const compareresult = comparefunc(element, testelement);
    if (compareresult > 0) // element > testelement
    {
      leftbound = testindex + 1;
    } else {
      rightbound = testindex;
    }
  }
  array.splice(leftbound, 0, element);
}

// Get the x coordinate of a point with a certain y coordinate, interpolated between two
// points (CSG.Vector2D).
// Interpolation is robust even if the points have the same y coordinate
export const interpolateBetween2DPointsForY = (point1: any, point2: any, y: number) => {
  let f1 = y - point1.y;
  let f2 = point2.y - point1.y;
  if (f2 < 0) {
    f1 = -f1;
    f2 = -f2;
  }
  let t;
  if (f1 <= 0) {
    t = 0.0;
  } else if (f1 >= f2) {
    t = 1.0;
  } else if (f2 < 1e-10) { // FIXME Should this be CSG.EPS?
    t = 0.5;
  } else {
    t = f1 / f2;
  }
  const result = point1.x + t * (point2.x - point1.x);
  return result;
};

export function isCAG(object: any) {
  // objects[i] instanceof CAG => NOT RELIABLE
  // 'instanceof' causes huge issues when using objects from
  // two different versions of CSG.js as they are not reckonized as one and the same
  // so DO NOT use instanceof to detect matching types for CSG/CAG
  if (!('sides' in object)) {
    return false;
  }

  if (!('length' in object.sides)) {
    return false;
  }

  return true;
}

export function isCSG(object: any) {
  // objects[i] instanceof CSG => NOT RELIABLE
  // 'instanceof' causes huge issues when using objects from
  // two different versions of CSG.js as they are not reckonized as one and the same
  // so DO NOT use instanceof to detect matching types for CSG/CAG
  if (!('polygons' in object)) {
    return false;
  }

  if (!('length' in object.polygons)) {
    return false;
  }

  return true;
}
