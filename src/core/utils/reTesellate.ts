import {FuzzyCSGFactory} from '@core/FuzzyFactory3d';
import {Polygon3, reTesselateCoplanarPolygons} from '@core/math';
import {fromPolygons} from '@core/CSGFactories';
import {CSG} from '@core/CSG';

/**
 * Re-Tessellate
 * @param csg
 */
export const reTessellate = (csg: CSG) => {
  if (csg.isRetesselated) {
    return csg;
  } else {
    const polygonsPerPlane: {
      [tagHash: string]: Polygon3[]
    } = {};
    const isCanonicalized = csg.isCanonicalized;
    const fuzzyfactory = new FuzzyCSGFactory();

    csg.polygons.map((polygon) => {

      let plane = polygon.plane;
      let shared = polygon.shared;

      if (!isCanonicalized) {
        // in order to identify polygons having the same plane, we need to canonicalize the planes
        // We don't have to do a full canonizalization (including vertices), to save time only do the planes and the shared data:
        plane = fuzzyfactory.getPlane(plane);
        shared = fuzzyfactory.getPolygonShared(shared);
      }

      const tag = plane.getTag() + '/' + shared.getTag();
      if (!(tag in polygonsPerPlane)) {
        polygonsPerPlane[tag] = [polygon];
      } else {
        polygonsPerPlane[tag].push(polygon);
      }

    });

    let destpolygons: Polygon3[] = [];

    // tslint:disable-next-line:forin
    for (const planetag in polygonsPerPlane) {
      const sourcepolygons = polygonsPerPlane[planetag];
      if (sourcepolygons.length < 2) {
        destpolygons = destpolygons.concat(sourcepolygons);
      } else {
        const retesselayedpolygons: Polygon3[] = [];
        reTesselateCoplanarPolygons(sourcepolygons, retesselayedpolygons);
        destpolygons = destpolygons.concat(retesselayedpolygons);
      }
    }

    const result = fromPolygons(destpolygons);
    result.isRetesselated = true;
    // result = result.canonicalized();
    result.properties = csg.properties; // keep original properties
    return result;
  }
};
