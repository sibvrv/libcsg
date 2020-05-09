import {CAG} from '../core/CAG'; // we have to import from top level otherwise prototypes are not complete..

export interface ISquareOptions {
  center: boolean;
  size: number | [number, number];
}

const defaults: ISquareOptions = {
  center: false,
  size: [1, 1],
};

/**
 * Construct a square/rectangle
 * @param {ISquareOptions} options - options for construction
 * @param {number} options.size - size of the square, either as array or scalar
 * @param {boolean} options.center - whether to center the square/rectangle or not
 * @returns {CAG} new square
 *
 * @example
 * let square1 = square({
 *   size: 10
 * })
 */
export function square(options?: Partial<ISquareOptions> | number | [number, number]) {
  const {center, size} = {
    ...defaults,
    ...(typeof options === 'number' ? {size: [options, options]} : (Array.isArray(options) ? {size: [...options]} : options)),
  } as ISquareOptions;

  const [halfWidth, halfHeight] = typeof size === 'number' ? [size / 2, size / 2] : [size[0] / 2, size[1] / 2];
  const offset = center ? [0, 0] : [halfWidth, halfHeight];

  return CAG.rectangle({center: offset, radius: [halfWidth, halfHeight]});
}
