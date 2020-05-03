import {geodesicSphere} from './geodesicSphere';

const {CSG} = require('../csg');
const {translate} = require('../modifiers/transforms');

/** Construct a sphere
 * @param {Object} [options] - options for construction
 * @param {Float} [options.r=1] - radius of the sphere
 * @param {Integer} [options.fn=32] - segments of the sphere (ie quality/resolution)
 * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
 * @param {String} [options.type='normal'] - type of sphere : either 'normal' or 'geodesic'
 * @returns {CSG} new sphere
 *
 * @example
 * let sphere1 = sphere({
 *   r: 10,
 *   fn: 20
 * })
 */
export function sphere(params: any) {
  const defaults = {
    r: 1,
    fn: 32,
    type: 'normal'
  };

  // tslint:disable-next-line:prefer-const
  let {r, fn, type} = Object.assign({}, defaults, params);
  let offset = [0, 0, 0]; // center: false (default)
  if (params && (typeof params !== 'object')) {
    r = params;
  }
  // let zoffset = 0 // sphere() in openscad has no center:true|false

  const output = type === 'geodesic' ? geodesicSphere(params) : CSG.sphere({radius: r, resolution: fn});

  // preparing individual x,y,z center
  if (params && params.center && params.center.length) {
    offset = [params.center[0] ? 0 : r, params.center[1] ? 0 : r, params.center[2] ? 0 : r];
  } else if (params && params.center === true) {
    offset = [0, 0, 0];
  } else if (params && params.center === false) {
    offset = [r, r, r];
  }
  return (offset[0] || offset[1] || offset[2]) ? translate(offset, output) : output;
}
