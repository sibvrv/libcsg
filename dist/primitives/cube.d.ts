export interface ICuboidOptions {
    size: number | [number, number, number];
    center: boolean | [boolean, boolean, boolean];
    round: boolean;
    radius: number;
    fn: number;
}
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
export declare function cube(options?: Partial<ICuboidOptions> | [number, number, number] | number): any;
//# sourceMappingURL=cube.d.ts.map