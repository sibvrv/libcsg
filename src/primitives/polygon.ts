import CAG from '../core/CAG';// we have to import from top level otherwise prototypes are not complete..
import {fromPoints} from '../core/CAGFactories';

/** Construct a polygon either from arrays of paths and points,
 * or just arrays of points nested paths (multiple paths) and flat paths are supported
 * @param {Object} [options] - options for construction or either flat or nested array of points
 * @param {Array} [options.points] - points of the polygon : either flat or nested array of points
 * @param {Array} [options.paths] - paths of the polygon : either flat or nested array of points index
 * @returns {CAG} new polygon
 *
 * @example
 * let roof = [[10,11], [0,11], [5,20]]
 * let wall = [[0,0], [10,0], [10,10], [0,10]]
 *
 * let poly = polygon(roof)
 * or
 * let poly = polygon([roof, wall])
 * or
 * let poly = polygon({ points: roof })
 * or
 * let poly = polygon({ points: [roof, wall] })
 * or
 * let poly = polygon({ points: roof, path: [0, 1, 2] })
 * or
 * let poly = polygon({ points: [roof, wall], path: [[0, 1, 2], [3, 4, 5, 6]] })
 * or
 * let poly = polygon({ points: roof.concat(wall), paths: [[0, 1, 2], [3, 4, 5], [3, 6, 5]] })
 */
export function polygon(params: any) { // array of po(ints) and pa(ths)
  let points: any[] = [];
  if (params.paths && params.paths.length && params.paths[0].length) { // pa(th): [[0,1,2],[2,3,1]] (two paths)
    if (typeof params.points[0][0] !== 'number') { // flatten points array
      params.points = params.points.reduce((a: any, b: any) => a.concat(b));
    }
    params.paths.forEach((path: any, i: number) => {
      points.push([]);
      path.forEach((j: any) => points[i].push(params.points[j]));
    });
  } else if (params.paths && params.paths.length) { // pa(th): [0,1,2,3,4] (single path)
    params.paths.forEach((i: any) => points.push(params.points[i]));
  } else { // pa(th) = po(ints)
    if (params.length) {
      points = params;
    } else {
      points = params.points;
    }
  }
  return fromPoints(points);
}
