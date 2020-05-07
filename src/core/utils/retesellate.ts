import {FuzzyCSGFactory} from '../FuzzyFactory3d';
import {reTesselateCoplanarPolygons} from '../math/reTesselateCoplanarPolygons';
import {fromPolygons} from '../CSGFactories';
import {CSG} from '../CSG';

export const reTesselate = (csg: CSG) => {
  if (csg.isRetesselated) {
    return csg;
  } else {
    const polygonsPerPlane = {};
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

    let destpolygons = [];
    for (const planetag in polygonsPerPlane) {
      const sourcepolygons = polygonsPerPlane[planetag];
      if (sourcepolygons.length < 2) {
        destpolygons = destpolygons.concat(sourcepolygons);
      } else {
        const retesselayedpolygons = [];
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
