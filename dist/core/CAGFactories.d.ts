import { Path2D, Side } from '@core/math';
import { CAG } from '@core/CAG';
import { CSG } from '@core/CSG';
/**
 * Construct a CAG from a list of `Side` instances.
 * @param {Side[]} sides - list of sides
 * @returns {CAG} new CAG object
 */
export declare const fromSides: (sides: Side[]) => CAG;
/**
 * Converts a CSG to a  The CSG must consist of polygons with only z coordinates +1 and -1
 * as constructed by _toCSGWall(-1, 1). This is so we can use the 3D union(), intersect() etc
 * @param csg
 */
export declare const fromFakeCSG: (csg: CSG) => CAG;
/**
 * Construct a CAG from a list of points (a polygon) or an nested array of points.
 * The rotation direction of the points is not relevant.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * Hole detection follows the even/odd rule,
 * which means that the order of the paths is not important.
 * @param {points[]|Array.<points[]>} points - (nested) list of points in 2D space
 * @returns {CAG} new CAG object
 */
export declare const fromPoints: (points: any) => CAG;
/**
 * Do not export the two following function (code splitting for fromPoints())
 * @param points
 */
export declare const fromPointsArray: (points: any) => CAG;
/**
 * From Nested Points Array
 * @param points
 */
export declare const fromNestedPointsArray: (points: any) => CAG;
/**
 * Reconstruct a CAG from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CAG} new CAG object
 */
export declare const fromObject: (obj: any) => CAG;
/**
 * Construct a CAG from a list of points (a polygon).
 * Like fromPoints() but does not check if the result is a valid polygon.
 * The points MUST rotate counter clockwise.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * @param {points[]} points - list of points in 2D space
 * @returns {CAG} new CAG object
 */
export declare const fromPointsNoCheck: (points: any) => CAG;
/**
 * Construct a CAG from a 2d-path (a closed sequence of points).
 * Like fromPoints() but does not check if the result is a valid polygon.
 * @param {path} Path2 - a Path2 path
 * @returns {CAG} new CAG object
 */
export declare const fromPath2: (path: Path2D) => CAG;
/**
 * Reconstruct a CAG from the output of toCompactBinary().
 * @param {CompactBinary} bin - see toCompactBinary()
 * @returns {CAG} new CAG object
 */
export declare const fromCompactBinary: (bin: any) => CAG;
//# sourceMappingURL=CAGFactories.d.ts.map