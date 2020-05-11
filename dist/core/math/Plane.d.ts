import { Line3D, Matrix4x4, TransformationMethods, TVector3Universal, Vector3 } from '.';
/**
 * @class Plane
 * Represents a plane in 3D space.
 */
export declare class Plane extends TransformationMethods {
    normal: Vector3;
    w: number;
    tag?: number;
    /**
     * create from an untyped object with identical property names:
     * @param obj
     */
    static fromObject<T extends Plane | {
        normal: TVector3Universal;
        w?: number | string;
    }>(obj: T): Plane;
    /**
     * make from 3D Vectors
     * @param a
     * @param b
     * @param c
     */
    static fromVector3Ds(a: Vector3, b: Vector3, c: Vector3): Plane;
    /**
     * like fromVector3Ds, but allow the vectors to be on one point or one line
     * in such a case a random plane through the given points is constructed
     * @param a
     * @param b
     * @param c
     */
    static anyPlaneFromVector3Ds(a: Vector3, b: Vector3, c: Vector3): Plane;
    /**
     * Make From Points
     * @param _a
     * @param _b
     * @param _c
     */
    static fromPoints(_a: TVector3Universal, _b: TVector3Universal, _c: TVector3Universal): Plane;
    /**
     * Make from normal and point
     * @param _normal
     * @param _point
     */
    static fromNormalAndPoint(_normal: TVector3Universal, _point: TVector3Universal): Plane;
    /**
     * Plane constructor
     * @param normal
     * @param w
     */
    constructor(normal: Vector3, w: number);
    /**
     * Get Flipped Plane
     */
    flipped(): Plane;
    /**
     * Get Tag
     */
    getTag(): number;
    /**
     * Plane-Plane equals
     * @param n
     */
    equals(n: Plane): boolean;
    /**
     * Transform helper
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): Plane;
    /**
     * robust splitting of a line by a plane
     * will work even if the line is parallel to the plane
     * @param p1
     * @param p2
     */
    splitLineBetweenPoints(p1: Vector3, p2: Vector3): Vector3;
    /**
     * Intersect With Line
     * returns Vector3D
     * @param line3d
     */
    intersectWithLine(line3d: Line3D): Vector3;
    /**
     * intersection of two planes
     * @param plane
     */
    intersectWithPlane(plane: Plane): Line3D;
    /**
     * Signed Distance To Point
     * @param point
     */
    signedDistanceToPoint(point: Vector3): number;
    /**
     * To String
     */
    toString(): string;
    /**
     * Mirror point
     * @param point3d
     */
    mirrorPoint(point3d: Vector3): Vector3;
}
//# sourceMappingURL=Plane.d.ts.map