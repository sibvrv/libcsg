const {CAG} = require('../csg');// we have to import from top level otherwise prototypes are not complete..

/** Construct a circle
 * @param {Object} [options] - options for construction
 * @param {Float} [options.r=1] - radius of the circle
 * @param {Integer} [options.fn=32] - segments of circle (ie quality/ resolution)
 * @param {Boolean} [options.center=true] - wether to center the circle or not
 * @returns {CAG} new circle
 *
 * @example
 * let circle1 = circle({
 *   r: 10
 * })
 */
export function circle(params: any) {
  const defaults = {
    r: 1,
    fn: 32,
    center: false
  };

  // tslint:disable-next-line:prefer-const
  let {r, fn, center} = Object.assign({}, defaults, params);
  if (params && !params.r && !params.fn && !params.center) r = params;
  const offset = center === true ? [0, 0] : [r, r];

  return CAG.circle({center: offset, radius: r, resolution: fn});
}
