import { Matrix4x4, Plane, TransformationMethods, TVector3Universal, Vector3 } from '.';
/**
 * Represents a line in 3D space
 * direction must be a unit vector
 * point is a random point on the line
 * @class Line3D
 */
export declare class Line3D extends TransformationMethods {
    point: Vector3;
    direction: Vector3;
    /**
     * Make Line3D from points
     * @param _p1
     * @param _p2
     */
    static fromPoints(_p1: TVector3Universal, _p2: TVector3Universal): Line3D;
    /**
     * Make Line3D from planes
     * @param p1
     * @param p2
     */
    static fromPlanes(p1: Plane, p2: Plane): Line3D;
    /**
     * Line3D Constructor
     */
    constructor(point: TVector3Universal, direction: TVector3Universal);
    /**
     * Intersect with plane
     * @param plane
     */
    intersectWithPlane(plane: Plane): Vector3;
    /**
     * Clone
     */
    clone(): Line3D;
    /**
     * Reverse
     */
    reverse(): Line3D;
    /**
     * Transform helper
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): Line3D;
    /**
     * Get closest point on line
     * @param _point
     */
    closestPointOnLine(_point: TVector3Universal): Vector3;
    /**
     * Distance to point
     * @param _point
     */
    distanceToPoint(_point: TVector3Universal): number;
    /**
     * Line-Line equals
     * @param line3d
     */
    equals(line3d: Line3D): boolean;
}
//# sourceMappingURL=Line3.d.ts.map