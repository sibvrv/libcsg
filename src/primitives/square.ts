const {CAG} = require('../csg');// we have to import from top level otherwise prototypes are not complete..

/** Construct a square/rectangle
 * @param {Object} [options] - options for construction
 * @param {Float} [options.size=1] - size of the square, either as array or scalar
 * @param {Boolean} [options.center=true] - wether to center the square/rectangle or not
 * @returns {CAG} new square
 *
 * @example
 * let square1 = square({
 *   size: 10
 * })
 */
export function square() {
  let v = [1, 1];
  let off;
  const a = arguments;
  let params = a[0];

  if (params && Number.isFinite(params)) v = [params, params];
  if (params && params.length) {
    v = a[0];
    params = a[1];
  }
  if (params && params.size && params.size.length) v = params.size;

  off = [v[0] / 2, v[1] / 2];
  if (params && params.center === true) off = [0, 0];

  return CAG.rectangle({center: off, radius: [v[0] / 2, v[1] / 2]});
}
