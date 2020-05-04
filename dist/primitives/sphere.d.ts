/**
 * Sphere Type Enum
 * @readonly
 * @enum {string}
 */
export declare const enum SPHERE_TYPE {
    NORMAL = "normal",
    GEODESIC = "geodesic"
}
export interface ISphereOptions {
    r: number;
    fn: number;
    center: boolean | [boolean, boolean, boolean];
    type: SPHERE_TYPE;
}
/** Construct a sphere
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
export declare function sphere(options?: Partial<ISphereOptions> | number): any;
//# sourceMappingURL=sphere.d.ts.map