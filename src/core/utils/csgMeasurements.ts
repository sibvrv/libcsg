const Vector3D = require('../math/Vector3');

/**
 * Returns an array of Vector3D, providing minimum coordinates and maximum coordinates
 * of this solid.
 * @returns {Vector3D[]}
 * @example
 * let bounds = A.getBounds()
 * let minX = bounds[0].x
 */
export const bounds = (csg: any) => {
  if (!csg.cachedBoundingBox) {
    let minpoint = new Vector3D(0, 0, 0);
    let maxpoint = new Vector3D(0, 0, 0);
    const polygons = csg.polygons;
    const numpolygons = polygons.length;
    for (let i = 0; i < numpolygons; i++) {
      const polygon = polygons[i];
      const _bounds = polygon.boundingBox();
      if (i === 0) {
        minpoint = _bounds[0];
        maxpoint = _bounds[1];
      } else {
        minpoint = minpoint.min(_bounds[0]);
        maxpoint = maxpoint.max(_bounds[1]);
      }
    }
    // FIXME: not ideal, we are mutating the input, we need to move some of it out
    csg.cachedBoundingBox = [minpoint, maxpoint];
  }
  return csg.cachedBoundingBox;
};

export const volume = (csg: any) => {
  const result = csg.toTriangles().map((triPoly: any) => {
    return triPoly.getTetraFeatures(['volume']);
  });
  // tslint:disable-next-line:no-console
  console.log('volume', result);
};

export const area = (csg: any) => {
  const result = csg.toTriangles().map((triPoly: any) => {
    return triPoly.getTetraFeatures(['area']);
  });
  // tslint:disable-next-line:no-console
  console.log('area', result);
};
