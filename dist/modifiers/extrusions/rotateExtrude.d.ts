import { CAG } from '@core/CAG';
export interface IRotateExtrude {
    angle: number;
    resolution: number;
}
/**
 * Extrude to into a 3D solid by rotating the origin around the Y axis.
 * (and turning everything into XY plane)
 * @param {Object} options - options for construction
 * @param {Number} [options.angle=360] - angle of rotation
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 */
export declare const rotateExtrude: (cag: CAG, options?: Partial<IRotateExtrude> | undefined) => import("../../main").CSG;
//# sourceMappingURL=rotateExtrude.d.ts.map