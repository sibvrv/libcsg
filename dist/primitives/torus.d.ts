import { CSG } from '../core/CSG';
export interface ITorusOptions {
    ri: number;
    ro: number;
    fni: number;
    fno: number;
    roti: number;
}
/**
 * Construct a Torus
 * @param {ITorusOptions} [options] - options for construction
 * @param {number} options.ri - radius of base circle
 * @param {number} options.ro - radius offset
 * @param {number} options.fni - segments of base circle (ie quality)
 * @param {number} options.fno - segments of extrusion (ie quality)
 * @param {number} options.roti - rotation angle of base circle
 * @returns {CSG} new torus
 *
 * @example
 * let torus1 = torus({
 *   ri: 10
 * })
 */
export declare function torus(options?: Partial<ITorusOptions>): CSG;
//# sourceMappingURL=torus.d.ts.map