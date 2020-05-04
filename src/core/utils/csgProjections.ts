const CAG = require('../CAG'); // FIXME: circular dependency !
import {EPS} from '../constants';

// project the 3D CSG onto a plane
// This returns a 2D CAG with the 'shadow' shape of the 3D solid when projected onto the
// plane represented by the orthonormal basis
export const projectToOrthoNormalBasis = (csg: any, orthobasis: any) => {
  const cags: any = [];

  csg.polygons
    .filter((p: any) => {
      // only return polys in plane, others may disturb result
      return p.plane.normal.minus(orthobasis.plane.normal).lengthSquared() < (EPS * EPS);
    })
    .map((polygon: any) => {
      const cag = polygon.projectToOrthoNormalBasis(orthobasis);
      if (cag.sides.length > 0) {
        cags.push(cag);
      }
    });

  const result = new CAG().union(cags);
  return result;
};
