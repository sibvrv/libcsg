interface ITorusOptions {
    ri: number;
    ro: number;
    fni: number;
    fno: number;
    roti: number;
}
/**
 * Construct a Torus
 * @param {ITorusOptions} [options] - options for construction
 * @param {number} [options.ri=1] - radius of base circle
 * @param {number} [options.ro=4] - radius offset
 * @param {number} [options.fni=16] - segments of base circle (ie quality)
 * @param {number} [options.fno=32] - segments of extrusion (ie quality)
 * @param {number} [options.roti=0] - rotation angle of base circle
 * @returns {CSG} new torus
 *
 * @example
 * let torus1 = torus({
 *   ri: 10
 * })
 */
export declare function torus(options?: ITorusOptions): any;
export {};
//# sourceMappingURL=torus.d.ts.map