import {translate} from '../modifiers/transforms';

const {CSG} = require('../csg');

export interface ICuboidOptions {
  size: number | [number, number, number];
  center: boolean | [boolean, boolean, boolean];
  round: boolean;
  radius: number;
  fn: number;
}

const defaults: ICuboidOptions = {
  size: 1,
  center: false,
  round: false,
  radius: 0,
  fn: 8,
};

/**
 * Construct a cuboid
 * @param {ICuboidOptions} options - options for construction
 * @param {boolean | boolean[]} options.center - center of cuboid
 * @param {number} options.size - dimensions of cuboid; width, depth, height
 * @returns {CSG} new cuboid
 *
 * @example
 * let cube1 = cube({
 *   r: 10,
 *   fn: 20
 * })
 */
export function cube(options?: Partial<ICuboidOptions> | [number, number, number]) {
  const {round, radius, fn, size, center} = {...defaults, ...(Array.isArray(options) ? {size: options} : options)} as ICuboidOptions;

  const [width, depth, height] = Array.isArray(size) ? size : [size, size, size];
  const roundRadius = (round || radius) && (radius ? radius : (width + depth + height) / 30) || 0;

  const halfSize = [width / 2, depth / 2, height / 2];

  const mesh = roundRadius
    ? CSG.roundedCube({radius: [...halfSize], roundradius: roundRadius, resolution: fn})
    : CSG.cube({radius: [...halfSize]});

  const offset = Array.isArray(center) ? [+!!!center[0] * halfSize[0], +!!!center[1] * halfSize[1], +!!!center[2] * halfSize[2]] : (!center ? [...halfSize] : [0, 0, 0]);

  return (offset[0] || offset[1] || offset[2]) ? translate(offset, mesh) : mesh;
}
