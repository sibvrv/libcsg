import { CAG } from '@core/CAG';
export interface ICircleOptions {
    r: number;
    fn: number;
    center: boolean;
}
/**
 * Construct a circle
 * @param {ICircleOptions} [options] - options for construction
 * @param {number} options.r - radius of the circle
 * @param {number} options.fn - segments of circle (ie quality/ resolution)
 * @param {boolean} options.center - whether to center the circle or not
 * @returns {CAG} new circle
 *
 * @example
 * let circle1 = circle({
 *   r: 10
 * })
 */
export declare function circle(options?: Partial<ICircleOptions> | number): CAG;
//# sourceMappingURL=circle.d.ts.map