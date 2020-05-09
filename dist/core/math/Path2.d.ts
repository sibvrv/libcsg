import { CAG } from '@core/CAG';
import { Matrix4x4, TransformationMethods, TVector2Universal, Vector2 } from '.';
export interface IPath2DArcOptions {
    center: any;
    radius: number;
    startangle: number;
    endangle: number;
    resolution: number;
    maketangent: boolean;
}
/**
 * Class Path2D
 * Represents a series of points, connected by infinitely thin lines.
 * A path can be open or closed, i.e. additional line between first and last points.
 * The difference between Path2D and CAG is that a path is a 'thin' line, whereas a CAG is an enclosed area.
 * @constructor
 * @param {Vector2[]} [points=[]] - list of points
 * @param {boolean} [closed=false] - closer of path
 *
 * @example
 * new CSG.Path2D()
 * new CSG.Path2D([[10,10], [-10,10], [-10,-10], [10,-10]], true) // closed
 */
export declare class Path2D extends TransformationMethods {
    lastBezierControlPoint?: Vector2;
    points: Vector2[];
    closed: boolean;
    /**
     * Construct an arc.
     * @param {Object} [options] - options for construction
     * @param {Vector2} [options.center=[0,0]] - center of circle
     * @param {Number} [options.radius=1] - radius of circle
     * @param {Number} [options.startangle=0] - starting angle of the arc, in degrees
     * @param {Number} [options.endangle=360] - ending angle of the arc, in degrees
     * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
     * @param {Boolean} [options.maketangent=false] - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent
     * @returns {Path2D} new Path2D object (not closed)
     *
     * @example
     * let path = CSG.Path2D.arc({
     *   center: [5, 5],
     *   radius: 10,
     *   startangle: 90,
     *   endangle: 180,
     *   resolution: 36,
     *   maketangent: true
     * });
     */
    static arc(options?: Partial<IPath2DArcOptions>): Path2D;
    constructor(points?: number[][] | Vector2[], closed?: boolean);
    concat(otherpath: Path2D): Path2D;
    /**
     * Get the points that make up the path.
     * note that this is current internal list of points, not an immutable copy.
     * @returns {Vector2[]} array of points the make up the path
     */
    getPoints(): Vector2[];
    /**
     * Append an point to the end of the path.
     * @param {Vector2} point - point to append
     * @returns {Path2D} new Path2D object (not closed)
     */
    appendPoint(point: number[] | Vector2): Path2D;
    /**
     * Append a list of points to the end of the path.
     * @param {Vector2[]} points - points to append
     * @returns {Path2D} new Path2D object (not closed)
     */
    appendPoints(points: number[][] | Vector2[]): Path2D;
    close(): Path2D;
    /**
     * Determine if the path is a closed or not.
     * @returns {Boolean} true when the path is closed, otherwise false
     */
    isClosed(): boolean;
    /**
     * Determine the overall clockwise or anti-clockwise turn of a path.
     * See: http://mathworld.wolfram.com/PolygonArea.html
     * @returns {String} One of ['clockwise', 'counter-clockwise', 'straight'].
     */
    getTurn(): "clockwise" | "counter-clockwise" | "straight";
    rectangularExtrude(width: number, height: number, resolution: number): import("../CSG").CSG;
    expandToCAG(pathradius: number, resolution: number): CAG;
    innerToCAG(): CAG;
    transform(matrix4x4: Matrix4x4): Path2D;
    /**
     * Append a Bezier curve to the end of the path, using the control points to transition the curve through start and end points.
     * <br>
     * The Bézier curve starts at the last point in the path,
     * and ends at the last given control point. Other control points are intermediate control points.
     * <br>
     * The first control point may be null to ensure a smooth transition occurs. In this case,
     * the second to last control point of the path is mirrored into the control points of the Bezier curve.
     * In other words, the trailing gradient of the path matches the new gradient of the curve.
     * @param {Vector2[]} controlpoints - list of control points
     * @param {Object} [options] - options for construction
     * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
     * @returns {Path2D} new Path2D object (not closed)
     *
     * @example
     * let p5 = new CSG.Path2D([[10,-20]],false);
     * p5 = p5.appendBezier([[10,-10],[25,-10],[25,-20]]);
     * p5 = p5.appendBezier([[25,-30],[40,-30],[40,-20]]);
     */
    appendBezier(controlpoints: number[][] | Vector2[], options?: any): Path2D;
    /**
     * Append an arc to the end of the path.
     * This implementation follows the SVG arc specs. For the details see
     * http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
     * @param {Vector2} endpoint - end point of arc
     * @param {Object} [options] - options for construction
     * @param {Number} [options.radius=0] - radius of arc (X and Y), see also xradius and yradius
     * @param {Number} [options.xradius=0] - X radius of arc, see also radius
     * @param {Number} [options.yradius=0] - Y radius of arc, see also radius
     * @param {Number} [options.xaxisrotation=0] -  rotation (in degrees) of the X axis of the arc with respect to the X axis of the coordinate system
     * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
     * @param {Boolean} [options.clockwise=false] - draw an arc clockwise with respect to the center point
     * @param {Boolean} [options.large=false] - draw an arc longer than 180 degrees
     * @returns {Path2D} new Path2D object (not closed)
     *
     * @example
     * let p1 = new CSG.Path2D([[27.5,-22.96875]],false);
     * p1 = p1.appendPoint([27.5,-3.28125]);
     * p1 = p1.appendArc([12.5,-22.96875],{xradius: 15,yradius: -19.6875,xaxisrotation: 0,clockwise: false,large: false});
     * p1 = p1.close();
     */
    appendArc(inEndpoint: TVector2Universal, options: any): Path2D;
}
//# sourceMappingURL=Path2.d.ts.map