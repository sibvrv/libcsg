import {Polygon3, PolygonShared, Vertex3} from '../core/math';
import {fromPolygons} from '../core/CSGFactories';
import {fnSortByIndex} from '../core/utils';

export interface ISolidFromSlices {
  loop: boolean;
  numslices: number;
  callback: any;
}

// FIXME: WHY is this for 3D polygons and not for 2D shapes ?
/**
 * Creates solid from slices (Polygon) by generating walls
 * @param {Object} options Solid generating options
 *  - numslices {Number} Number of slices to be generated
 *  - callback(t, slice) {Function} Callback function generating slices.
 *          arguments: t = [0..1], slice = [0..numslices - 1]
 *          return: Polygon or null to skip
 *  - loop {Boolean} no flats, only walls, it's used to generate solids like a tor
 */
export const solidFromSlices = (polygon: Polygon3, options: ISolidFromSlices) => {
  const polygons: Polygon3[] = [];
  let csg = null;
  let prev = null;
  let bottom: Polygon3 = null!;
  let top: Polygon3 = null!;
  let numSlices = 2;
  let bLoop = false;
  let fnCallback;
  let flipped: boolean | null = null;

  if (options) {
    bLoop = Boolean(options.loop);

    if (options.numslices) {
      numSlices = options.numslices;
    }

    if (options.callback) {
      fnCallback = options.callback;
    }
  }
  if (!fnCallback) {
    const square = Polygon3.createFromPoints([
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ]);
    fnCallback = (t: number/* , slice */) => {
      return t === 0 || t === 1 ? square.translate([0, 0, t]) : null;
    };
  }
  for (let i = 0, iMax = numSlices - 1; i <= iMax; i++) {
    csg = fnCallback.call(polygon, i / iMax, i);
    if (csg) {
      if (!(csg instanceof Polygon3)) {
        throw new Error('Polygon.solidFromSlices callback error: Polygon expected');
      }
      csg.checkIfConvex();

      if (prev) { // generate walls
        if (flipped === null) { // not generated yet
          flipped = prev.plane.signedDistanceToPoint(csg.vertices[0].pos) < 0;
        }
        _addWalls(polygons, prev, csg, flipped);
      } else { // the first - will be a bottom
        bottom = csg;
      }
      prev = csg;
    } // callback can return null to skip that slice
  }
  top = csg;

  if (bLoop) {
    const bSameTopBottom = bottom.vertices.length === top.vertices.length &&
      bottom.vertices.every((v, index) => {
        return v.pos.equals(top.vertices[index].pos);
      });
    // if top and bottom are not the same -
    // generate walls between them
    if (!bSameTopBottom) {
      _addWalls(polygons, top, bottom, Boolean(flipped));
    } // else - already generated
  } else {
    // save top and bottom
    // TODO: flip if necessary
    polygons.unshift(flipped ? bottom : bottom.flipped());
    polygons.push(flipped ? top.flipped() : top);
  }
  return fromPolygons(polygons);
};

/**
 * @param walls Array of wall polygons
 * @param bottom Bottom polygon
 * @param top Top polygon
 */
const _addWalls = (walls: Polygon3[], bottom: Polygon3, top: Polygon3, bFlipped: boolean) => {
  let bottomPoints = bottom.vertices.slice(0); // make a copy
  let topPoints = top.vertices.slice(0); // make a copy
  const color = top.shared || null;

  // check if bottom perimeter is closed
  if (!bottomPoints[0].pos.equals(bottomPoints[bottomPoints.length - 1].pos)) {
    bottomPoints.push(bottomPoints[0]);
  }

  // check if top perimeter is closed
  if (!topPoints[0].pos.equals(topPoints[topPoints.length - 1].pos)) {
    topPoints.push(topPoints[0]);
  }
  if (bFlipped) {
    bottomPoints = bottomPoints.reverse();
    topPoints = topPoints.reverse();
  }

  const iTopLen = topPoints.length - 1;
  const iBotLen = bottomPoints.length - 1;
  const iExtra = iTopLen - iBotLen;// how many extra triangles we need
  const bMoreTops = iExtra > 0;
  const bMoreBottoms = iExtra < 0;

  const aMin: any = []; // indexes to start extra triangles (polygon with minimal square)
  // init - we need exactly /iExtra/ small triangles
  for (let i = Math.abs(iExtra); i > 0; i--) {
    aMin.push({
      len: Infinity,
      index: -1,
    });
  }

  let len;
  if (bMoreBottoms) {
    for (let i = 0; i < iBotLen; i++) {
      len = bottomPoints[i].pos.distanceToSquared(bottomPoints[i + 1].pos);
      // find the element to replace
      for (let j = aMin.length - 1; j >= 0; j--) {
        if (aMin[j].len > len) {
          aMin[j].len = len;
          aMin.index = j; // todo !! fix me
          break;
        }
      } // for
    }
  } else if (bMoreTops) {
    for (let i = 0; i < iTopLen; i++) {
      len = topPoints[i].pos.distanceToSquared(topPoints[i + 1].pos);
      // find the element to replace
      for (let j = aMin.length - 1; j >= 0; j--) {
        if (aMin[j].len > len) {
          aMin[j].len = len;
          aMin.index = j;
          break;
        }
      } // for
    }
  } // if
  // sort by index
  aMin.sort(fnSortByIndex);
  const getTriangle = (pointA: Vertex3, pointB: Vertex3, pointC: Vertex3, triColor: PolygonShared | null) => { // function addWallsPutTriangle
    return new Polygon3([pointA, pointB, pointC], triColor);
    // return bFlipped ? triangle.flipped() : triangle;
  };

  let bpoint = bottomPoints[0];
  let tpoint = topPoints[0];
  let secondPoint;
  let nBotFacet;
  let nTopFacet; // length of triangle facet side
  for (let iB = 0, iT = 0, iMax = iTopLen + iBotLen; iB + iT < iMax;) {
    if (aMin.length) {
      if (bMoreTops && iT === aMin[0].index) { // one vertex is on the bottom, 2 - on the top
        secondPoint = topPoints[++iT];
        // console.log('<<< extra top: ' + secondPoint + ', ' + tpoint + ', bottom: ' + bpoint);
        walls.push(getTriangle(
          secondPoint, tpoint, bpoint, color,
        ));
        tpoint = secondPoint;
        aMin.shift();
        continue;
      } else if (bMoreBottoms && iB === aMin[0].index) {
        secondPoint = bottomPoints[++iB];
        walls.push(getTriangle(
          tpoint, bpoint, secondPoint, color,
        ));
        bpoint = secondPoint;
        aMin.shift();
        continue;
      }
    }
    // choose the shortest path
    if (iB < iBotLen) { // one vertex is on the top, 2 - on the bottom
      nBotFacet = tpoint.pos.distanceToSquared(bottomPoints[iB + 1].pos);
    } else {
      nBotFacet = Infinity;
    }
    if (iT < iTopLen) { // one vertex is on the bottom, 2 - on the top
      nTopFacet = bpoint.pos.distanceToSquared(topPoints[iT + 1].pos);
    } else {
      nTopFacet = Infinity;
    }
    if (nBotFacet <= nTopFacet) {
      secondPoint = bottomPoints[++iB];
      walls.push(getTriangle(
        tpoint, bpoint, secondPoint, color,
      ));
      bpoint = secondPoint;
    } else if (iT < iTopLen) { // nTopFacet < Infinity
      secondPoint = topPoints[++iT];
      // console.log('<<< top: ' + secondPoint + ', ' + tpoint + ', bottom: ' + bpoint);
      walls.push(getTriangle(
        secondPoint, tpoint, bpoint, color,
      ));
      tpoint = secondPoint;
    }
  }
  return walls;
};
