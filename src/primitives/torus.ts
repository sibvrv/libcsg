const {CSG} = require('../csg');
const {circle} = require('./');
const {rotate_extrude} = require('../modifiers/extrusions');
const {translate} = require('../modifiers/transforms');

const MIN_FNI = 3;
const MIN_FNO = 3;

interface ITorusOptions {
  ri: number;
  ro: number;
  fni: number;
  fno: number;
  roti: number;
}

const defaults: ITorusOptions = {
  ri: 1,
  ro: 4,
  fni: 16,
  fno: 32,
  roti: 0,
};

/**
 * Construct a Torus
 * @param {ITorusOptions} [options] - options for construction
 * @param {number} [options.ri=1] - radius of base circle
 * @param {number} [options.ro=4] - radius offset
 * @param {number} [options.fni=16] - segments of base circle (ie quality)
 * @param {number} [options.fno=32] - segments of extrusion (ie quality)
 * @param {number} [options.roti=0] - rotation angle of base circle
 * @returns {CSG} new torus
 *
 * @example
 * let torus1 = torus({
 *   ri: 10
 * })
 */
export function torus(options?: ITorusOptions) {
  const {ri, ro, fni, fno, roti} = {...defaults, ...options};

  let baseCircle = circle({r: ri, fn: Math.max(MIN_FNI, fni), center: true});
  if (roti) baseCircle = baseCircle.rotateZ(roti);

  return rotate_extrude({fn: Math.max(MIN_FNO, fno)}, translate([ro, 0, 0], baseCircle));
}
