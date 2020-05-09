import {Path2D} from '../../core/math';

/** rectangular extrusion of the given array of points
 * @param {Array} basePoints array of points (nested) to extrude from
 * layed out like [ [0,0], [10,0], [5,10], [0,10] ]
 * @param {Object} [options] - options for construction
 * @param {Float} [options.h=1] - height of the extruded shape
 * @param {Float} [options.w=10] - width of the extruded shape
 * @param {Integer} [options.fn=1] - resolution/number of segments of the extrusion
 * @param {Boolean} [options.closed=false] - whether to close the input path for the extrusion or not
 * @param {Boolean} [options.round=true] - whether to round the extrusion or not
 * @returns {CSG} new extruded shape
 *
 * @example
 * let revolved = rectangular_extrude({height: 10}, square())
 */
export function rectangular_extrude(basePoints: any, params?: any) {
  const defaults = {
    w: 1,
    h: 1,
    fn: 8,
    closed: false,
    // round: true, // not supported
  };
  const {w, h, fn, closed} = Object.assign({}, defaults, params);
  return new Path2D(basePoints, closed).rectangularExtrude(w, h, fn);
}
