import { TVector2Universal } from '@core/math';
export interface ICircleOptions {
    center: TVector2Universal;
    radius: number;
    resolution: number;
}
/**
 * Construct a circle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of circle
 * @param {Number} [options.radius=1] - radius of circle
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 */
export declare const circle: (options?: Partial<ICircleOptions>) => import("../../main").CAG;
export interface IEllipse {
    center: TVector2Universal;
    radius: TVector2Universal;
    resolution: number;
}
/**
 * Construct an ellispe.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of ellipse
 * @param {Vector2D} [options.radius=[1,1]] - radius of ellipse, width and height
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 */
export declare const ellipse: (options?: Partial<IEllipse>) => import("../../main").CAG;
export interface IRectangle {
    corner1: TVector2Universal;
    corner2: TVector2Universal;
    center: TVector2Universal;
    radius: TVector2Universal;
}
/**
 * Construct a rectangle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of rectangle
 * @param {Vector2D} [options.radius=[1,1]] - radius of rectangle, width and height
 * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rectangle (alternate)
 * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rectangle (alternate)
 * @returns {CAG} new CAG object
 */
export declare const rectangle: (options?: Partial<IRectangle>) => import("../../main").CAG;
export interface IRoundedRectangle {
    roundradius: number;
    resolution: number;
}
export interface IRoundedRectangleNormal {
    center: TVector2Universal;
    radius: TVector2Universal;
}
export interface IRoundedRectangleCorner {
    corner1: TVector2Universal;
    corner2: TVector2Universal;
}
/**
 * Construct a rounded rectangle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of rounded rectangle
 * @param {Vector2D} [options.radius=[1,1]] - radius of rounded rectangle, width and height
 * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rounded rectangle (alternate)
 * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rounded rectangle (alternate)
 * @param {Number} [options.roundradius=0.2] - round radius of corners
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 *
 * @example
 * let r = roundedRectangle({
 *   center: [0, 0],
 *   radius: [5, 10],
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
export declare const roundedRectangle: (options?: Partial<IRoundedRectangleNormal & IRoundedRectangle> | Partial<IRoundedRectangleCorner & IRoundedRectangle>) => import("../../main").CAG;
//# sourceMappingURL=primitives2d.d.ts.map