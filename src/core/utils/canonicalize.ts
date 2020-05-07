import {EPS} from '../constants';
import {FuzzyCSGFactory} from '../FuzzyFactory3d';
import {FuzzyCAGFactory} from '../FuzzyFactory2d';
import {fromPolygons} from '../CSGFactories';
import {fromSides} from '../CAGFactories';
import {CSG} from '../CSG';
import {CAG} from '../CAG';

/**
 * Returns a cannoicalized version of the input csg/cag : ie every very close
 * points get deduplicated
 * @returns {CSG|CAG}
 * @example
 * let rawInput = someCSGORCAGMakingFunction()
 * let canonicalized= canonicalize(rawInput)
 */
export const canonicalize = (csgOrCAG: CSG | CAG, options) => {
  if (csgOrCAG.isCanonicalized) {
    return csgOrCAG;
  } else {
    if ('sides' in csgOrCAG) {
      return canonicalizeCAG(csgOrCAG, options);
    } else {
      return canonicalizeCSG(csgOrCAG, options);
    }
  }
};

/**
 * Returns a cannoicalized version of the input csg : ie every very close
 * points get deduplicated
 * @returns {CSG}
 * @example
 * let rawCSG = someCSGMakingFunction()
 * let canonicalizedCSG = canonicalize(rawCSG)
 */
const canonicalizeCSG = (csg: CSG, options) => {
  if (csg.isCanonicalized) {
    return csg;
  } else {
    const factory = new FuzzyCSGFactory();
    const result = CSGFromCSGFuzzyFactory(factory, csg);
    result.isCanonicalized = true;
    result.isRetesselated = csg.isRetesselated;
    result.properties = csg.properties; // keep original properties
    return result;
  }
};

const canonicalizeCAG = (cag: CAG, options) => {
  if (cag.isCanonicalized) {
    return cag;
  } else {
    const factory = new FuzzyCAGFactory();
    const result = CAGFromCAGFuzzyFactory(factory, cag);
    result.isCanonicalized = true;
    return result;
  }
};

const CSGFromCSGFuzzyFactory = (factory, sourcecsg: CSG) => {
  const _this = factory;
  const newpolygons = [];

  sourcecsg.polygons
    .forEach((polygon) => {
      const newpolygon = _this.getPolygon(polygon);
      // see getPolygon above: we may get a polygon with no vertices, discard it:
      if (newpolygon.vertices.length >= 3) {
        newpolygons.push(newpolygon);
      }
    });

  return fromPolygons(newpolygons);
};

const CAGFromCAGFuzzyFactory = (factory, sourcecag) => {
  const _this = factory;

  const newsides = sourcecag.sides
    .map((side) => {
      return _this.getSide(side);
    })
    // remove bad sides (mostly a user input issue)
    .filter((side) => {
      return side.length() > EPS;
    });

  return fromSides(newsides);
};
