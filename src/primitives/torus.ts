const {CSG} = require('../csg');
const {circle} = require('./');
const {rotate_extrude} = require('../modifiers/extrusions');
const {translate, scale} = require('../modifiers/transforms');
const Polygon3 = require('../core/math/Polygon3');
const Vector3 = require('../core/math/Vector3');
const Vertex3 = require('../core/math/Vertex3');

/** Construct a torus
 * @param {Object} [options] - options for construction
 * @param {Float} [options.ri=1] - radius of base circle
 * @param {Float} [options.ro=4] - radius offset
 * @param {Integer} [options.fni=16] - segments of base circle (ie quality)
 * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
 * @param {Integer} [options.roti=0] - rotation angle of base circle
 * @returns {CSG} new torus
 *
 * @example
 * let torus1 = torus({
 *   ri: 10
 * })
 */
export function torus(params: any) {
  const defaults = {
    ri: 1,
    ro: 4,
    fni: 16,
    fno: 32,
    roti: 0
  };
  params = Object.assign({}, defaults, params);

  /* possible enhancements ? declarative limits
  const limits = {
    fni: {min: 3},
    fno: {min: 3}
  } */

  // tslint:disable-next-line:prefer-const
  let {ri, ro, fni, fno, roti} = params;

  if (fni < 3) fni = 3;
  if (fno < 3) fno = 3;

  let baseCircle = circle({r: ri, fn: fni, center: true});

  if (roti) baseCircle = baseCircle.rotateZ(roti);
  const result = rotate_extrude({fn: fno}, translate([ro, 0, 0], baseCircle));
  // result = result.union(result)
  return result;
}
