import {translate} from '../modifiers/transforms';
const {CSG} = require('../csg');

/** Construct a cylinder
 * @param {Object} [options] - options for construction
 * @param {Float} [options.r=1] - radius of the cylinder
 * @param {Float} [options.r1=1] - radius of the top of the cylinder
 * @param {Float} [options.r2=1] - radius of the bottom of the cylinder
 * @param {Float} [options.d=1] - diameter of the cylinder
 * @param {Float} [options.d1=1] - diameter of the top of the cylinder
 * @param {Float} [options.d2=1] - diameter of the bottom of the cylinder
 * @param {Integer} [options.fn=32] - number of sides of the cylinder (ie quality/resolution)
 * @returns {CSG} new cylinder
 *
 * @example
 * let cylinder = cylinder({
 *   d: 10,
 *   fn: 20
 * })
 */
export function cylinder(params?: any) {
  const defaults = {
    r: 1,
    r1: 1,
    r2: 1,
    h: 1,
    fn: 32,
    round: false
  };

  // tslint:disable-next-line:prefer-const
  let {r1, r2, h, fn, round} = Object.assign({}, defaults, params);
  let offset = [0, 0, 0];
  let a = arguments;
  if (params && params.d) {
    r1 = r2 = params.d / 2;
  }
  if (params && params.r) {
    r1 = params.r;
    r2 = params.r;
  }
  if (params && params.h) {
    h = params.h;
  }
  if (params && (params.r1 || params.r2)) {
    r1 = params.r1;
    r2 = params.r2;
    if (params.h) h = params.h;
  }
  if (params && (params.d1 || params.d2)) {
    r1 = params.d1 / 2;
    r2 = params.d2 / 2;
  }

  if (a && a[0] && a[0].length) {
    a = a[0];
    r1 = a[0];
    r2 = a[1];
    h = a[2];
    if (a.length === 4) fn = a[3];
  }

  let object;
  if (params && (params.start && params.end)) {
    object = round
      ? CSG.roundedCylinder({start: params.start, end: params.end, radiusStart: r1, radiusEnd: r2, resolution: fn})
      : CSG.cylinder({start: params.start, end: params.end, radiusStart: r1, radiusEnd: r2, resolution: fn});
  } else {
    object = round
      ? CSG.roundedCylinder({start: [0, 0, 0], end: [0, 0, h], radiusStart: r1, radiusEnd: r2, resolution: fn})
      : CSG.cylinder({start: [0, 0, 0], end: [0, 0, h], radiusStart: r1, radiusEnd: r2, resolution: fn});
    const r = r1 > r2 ? r1 : r2;
    if (params && params.center && params.center.length) { // preparing individual x,y,z center
      offset = [params.center[0] ? 0 : r, params.center[1] ? 0 : r, params.center[2] ? -h / 2 : 0];
    } else if (params && params.center === true) {
      offset = [0, 0, -h / 2];
    } else if (params && params.center === false) {
      offset = [0, 0, 0];
    }
    object = (offset[0] || offset[1] || offset[2]) ? translate(offset, object) : object;
  }
  return object;
}
