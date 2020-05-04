export interface IGeodesicSphereOptions {
    r: number;
    fn: number;
}
/**
 * Geodesic Sphere
 * @param {IGeodesicSphereOptions} options - options for construction
 * @param {number} options.r - radius of the sphere
 * @param {number} options.fn - segments of the sphere (ie quality/resolution)
 */
export declare function geodesicSphere(options?: Partial<IGeodesicSphereOptions>): any;
//# sourceMappingURL=geodesicSphere.d.ts.map