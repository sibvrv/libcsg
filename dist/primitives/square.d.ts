export interface ISquareOptions {
    center: boolean;
    size: number | [number, number];
}
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
export declare function square(options?: Partial<ISquareOptions> | number | [number, number]): any;
//# sourceMappingURL=square.d.ts.map