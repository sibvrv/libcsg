const {CSG} = require('../csg');
const {translate} = require('../modifiers/transforms');

/** Construct a cuboid
 * @param {Object} [options] - options for construction
 * @param {Float} [options.size=1] - size of the side of the cuboid : can be either:
 * - a scalar : ie a single float, in which case all dimensions will be the same
 * - or an array: to specify different dimensions along x/y/z
 * @param {Integer} [options.fn=32] - segments of the sphere (ie quality/resolution)
 * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
 * @param {String} [options.type='normal'] - type of sphere : either 'normal' or 'geodesic'
 * @returns {CSG} new sphere
 *
 * @example
 * let cube1 = cube({
 *   r: 10,
 *   fn: 20
 * })
 */
export function cube(params: any) {
  const defaults = {
    size: 1,
    offset: [0, 0, 0],
    round: false,
    radius: 0,
    fn: 8,
  };

  // tslint:disable-next-line:prefer-const
  let {round, radius, fn, size} = Object.assign({}, defaults, params);
  let offset = [0, 0, 0];
  let v = null;
  if (params && params.length) v = params;
  if (params && params.size && params.size.length) v = params.size; // { size: [1,2,3] }
  if (params && params.size && !params.size.length) size = params.size; // { size: 1 }
  if (params && (typeof params !== 'object')) size = params;// (2)
  if (params && params.round === true) {
    round = true;
    radius = v && v.length ? (v[0] + v[1] + v[2]) / 30 : size / 10;
  }
  if (params && params.radius) {
    round = true;
    radius = params.radius;
  }

  let x = size;
  let y = size;
  let z = size;
  if (v && v.length) {
    [x, y, z] = v;
  }
  offset = [x / 2, y / 2, z / 2]; // center: false default
  const object = round
    ? CSG.roundedCube({radius: [x / 2, y / 2, z / 2], roundradius: radius, resolution: fn})
    : CSG.cube({radius: [x / 2, y / 2, z / 2]});
  if (params && params.center && params.center.length) {
    offset = [params.center[0] ? 0 : x / 2, params.center[1] ? 0 : y / 2, params.center[2] ? 0 : z / 2];
  } else if (params && params.center === true) {
    offset = [0, 0, 0];
  } else if (params && params.center === false) {
    offset = [x / 2, y / 2, z / 2];
  }
  return (offset[0] || offset[1] || offset[2]) ? translate(offset, object) : object;
}
