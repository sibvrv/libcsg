import { Matrix4x4, TransformationMethods, TVector2Universal, Vector2 } from '.';
/**
 * Line2D
 * Represents a directional line in 2D space
 * A line is parametrized by its normal vector (perpendicular to the line, rotated 90 degrees counter clockwise)
 * and w. The line passes through the point <normal>.times(w).
 * Equation: p is on line if normal.dot(p)==w
 *
 * @param {Vector2} normal normal must be a unit vector!
 * @returns {Line2D}
 */
export declare class Line2D extends TransformationMethods {
    normal: Vector2;
    w: number;
    static fromPoints(_p1: TVector2Universal, _p2: TVector2Universal): Line2D;
    /**
     * Line2D Constructor
     */
    constructor(_normal: TVector2Universal, w: number | string);
    reverse(): Line2D;
    equals(l: Line2D): boolean;
    origin(): Vector2;
    direction(): Vector2;
    xAtY(y: number): number;
    absDistanceToPoint(point: Vector2 | [number, number]): number;
    intersectWithLine(line2d: Line2D): Vector2;
    transform(matrix4x4: Matrix4x4): Line2D;
}
//# sourceMappingURL=Line2.d.ts.map