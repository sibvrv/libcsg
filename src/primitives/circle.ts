const {CAG} = require('../csg');// we have to import from top level otherwise prototypes are not complete..

export interface ICircleOptions {
  r: number;
  fn: number;
  center: boolean;
}

const defaults: ICircleOptions = {
  r: 1,
  fn: 32,
  center: false,
};

/** Construct a circle
 * @param {ICircleOptions} [options] - options for construction
 * @param {number} [options.r=1] - radius of the circle
 * @param {number} [options.fn=32] - segments of circle (ie quality/ resolution)
 * @param {boolean} [options.center=true] - whether to center the circle or not
 * @returns {CAG} new circle
 *
 * @example
 * let circle1 = circle({
 *   r: 10
 * })
 */
export function circle(options?: ICircleOptions | number) {

  const {r, fn, center} = {...defaults, ...(typeof options === 'number' ? {r: options} : options)} as ICircleOptions;
  const offset = center ? [0, 0] : [r, r];

  return CAG.circle({center: offset, radius: r, resolution: fn});
}
