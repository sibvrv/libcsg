import {ConvexHull} from './helpers/ConvexHull';
import {fromPoints} from '../../core/CAGFactories';
import {isCAG} from '../../core/utils';

/**
 * Create a convex hull of the given shapes
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to create a hull around
 * @returns {CSG} new CSG object , a hull around the given shapes
 *
 * @example
 * let hulled = hull(rect(), circle())
 */
export function hull(...objects: any[]) {
  const pts = [];

  let a = objects;
  if (a[0].length) a = a[0];

  const done: {
    [hash: string]: number
  } = {};

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < a.length; i++) {              // extract all points of the CAG in the argument list
    const cag = a[i];
    if (!isCAG(cag)) {
      throw new Error('ERROR: hull() accepts only 2D forms / CAG');
    }

    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < cag.sides.length; j++) {
      const x = cag.sides[j].vertex0.pos.x;
      const y = cag.sides[j].vertex0.pos.y;
      // avoid some coord to appear multiple times
      if (done['' + x + ',' + y]) {
        continue;
      }
      pts.push({x, y});
      done['' + x + ',' + y]++;
      // echo(x,y);
    }
  }
  // echo(pts.length+" points in",pts);
  const convexHull = new ConvexHull();

  convexHull.compute(pts);
  const indices = convexHull.getIndices();

  if (indices && indices.length > 0) {
    const ch = [];

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < indices.length; i++) {
      ch.push(pts[indices[i]]);
    }
    return fromPoints(ch);
  }
}
