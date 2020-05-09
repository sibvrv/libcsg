import {geodesicSphere} from './geodesicSphere';
import {translate} from '../modifiers/transforms';
import {CSG} from '../core/CSG';

/**
 * Sphere Type Enum
 * @readonly
 * @enum {string}
 */
export const enum SPHERE_TYPE {
  NORMAL = 'normal',
  GEODESIC = 'geodesic',
}

export interface ISphereOptions {
  r: number;
  fn: number;
  center: boolean | [boolean, boolean, boolean];
  type: SPHERE_TYPE;
}

const defaults: Partial<ISphereOptions> = {
  r: 1,
  fn: 32,
  type: SPHERE_TYPE.NORMAL,
};

/**
 * Construct a sphere
 * @param {ISphereOptions} [options] - options for construction
 * @param {number} options.r - radius of the sphere
 * @param {number} options.fn - segments of the sphere (ie quality/resolution)
 * @param {SPHERE_TYPE} options.type - type of sphere : either 'normal' or 'geodesic'
 * @returns {CSG} new sphere
 *
 * @example
 * let sphere1 = sphere({
 *   r: 10,
 *   fn: 20
 * })
 */
export function sphere(options?: Partial<ISphereOptions> | number) {
  const {r, fn, center, type} = {...defaults, ...(typeof options === 'number' ? {r: options} : options)} as ISphereOptions;

  // preparing individual x,y,z center
  // center: false (default)
  const offset = Array.isArray(center) ? [+!!!center[0] * r, +!!!center[1] * r, +!!!center[2] * r] : (typeof center === 'boolean' && !center ? [r, r, r] : [0, 0, 0]);

  const mesh = type === SPHERE_TYPE.GEODESIC ? geodesicSphere({r, fn}) : CSG.sphere({radius: r, resolution: fn});

  return (offset[0] || offset[1] || offset[2]) ? translate(offset, mesh) : mesh;
}
