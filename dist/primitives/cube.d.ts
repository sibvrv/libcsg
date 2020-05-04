export interface ICuboidOptions {
    size: number | [number, number, number];
    center: boolean | [boolean, boolean, boolean];
    round: boolean;
    radius: number;
    fn: number;
}
/**
 * Construct a cuboid
 * @param {ICuboidOptions} [options] - options for construction
 * @param {boolean | boolean[]} [options.center=false] - center of cuboid
 * @param {number} [options.size=1] - dimensions of cuboid : can be either:
 * - a scalar : ie a single float, in which case all dimensions will be the same
 * - or an array: to specify different dimensions along x/y/z
 * @returns {CSG} new cuboid
 *
 * @example
 * let cube1 = cube({
 *   r: 10,
 *   fn: 20
 * })
 */
export declare function cube(options?: Partial<ICuboidOptions> | [number, number, number]): any;
//# sourceMappingURL=cube.d.ts.map