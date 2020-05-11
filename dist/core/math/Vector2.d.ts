import { Matrix4x4, TransformationMethods, Vector3 } from '.';
export declare type TVector2Universal = Vector2 | Vector3 | [number, number] | number[] | {
    x?: number | string;
    y?: number | string;
};
/**
 * Represents a 2D vector with X, Y coordinates
 * @class Vector2
 * @constructor
 *
 * @example
 * new CSG.Vector2(1, 2);
 * new CSG.Vector2([1, 2]);
 * new CSG.Vector2({ x: 1, y: 2});
 */
export declare class Vector2 extends TransformationMethods {
    _x: number;
    _y: number;
    /**
     * make from angle
     * @param radians
     */
    static fromAngle(radians: number): Vector2;
    /**
     * make from angle in degrees
     * @param degrees
     */
    static fromAngleDegrees(degrees: number): Vector2;
    /**
     * make from angle in radians
     * @param radians
     */
    static fromAngleRadians(radians: number): Vector2;
    /**
     * This does the same as new Vector2(x,y) but it doesn't go through the constructor and the parameters are not validated. Is much faster.
     * @param x
     * @param y
     * @constructor
     */
    static Create(x: number, y: number): Vector2;
    /**
     * Vector2 Constructor
     * @param x
     * @param y
     */
    constructor(x?: number | string | TVector2Universal, y?: number | string);
    /**
     * Get X
     */
    get x(): number;
    /**
     * Set X is not allowed, Vector2 is immutable
     * @param v
     */
    set x(v: number);
    /**
     * Get Y
     */
    get y(): number;
    /**
     * Set Y is not allowed, Vector2 is immutable
     * @param v
     */
    set y(v: number);
    /**
     * extend to a 3D vector by adding a z coordinate:
     * @param z
     */
    toVector3D(z?: number): Vector3;
    /**
     * is vectors equal
     * @param a
     */
    equals(a: Vector2): boolean;
    /**
     * Clone
     */
    clone(): Vector2;
    /**
     * return negated vector
     */
    negated(): Vector2;
    /**
     * Plus
     * @param a
     */
    plus(a: Vector2): Vector2;
    /**
     * Minus
     * @param a
     */
    minus(a: Vector2): Vector2;
    /**
     * scalar scale
     * @param a
     */
    times(a: number): Vector2;
    /**
     * divided by value
     * @param a
     */
    dividedBy(a: number): Vector2;
    /**
     * Find The Dot Product Of Two Vectors
     * @param a
     */
    dot(a: Vector2): number;
    /**
     * Lerp
     * @param a
     * @param t
     */
    lerp(a: Vector2, t: number): Vector2;
    /**
     * Vector length
     */
    length(): number;
    /**
     * Distance to point
     * @param a
     */
    distanceTo(a: Vector2): number;
    /**
     * Squared distance between two points
     * @param a
     */
    distanceToSquared(a: Vector2): number;
    /**
     * Squared Length
     */
    lengthSquared(): number;
    /**
     * Unit Vector
     */
    unit(): Vector2;
    /**
     * Cross product
     * @param a
     */
    cross(a: Vector2): number;
    /**
     * returns the vector rotated by 90 degrees clockwise
     */
    normal(): Vector2;
    /**
     * Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
     * Returns a new Vector2
     * @param matrix4x4
     */
    multiply4x4(matrix4x4: Matrix4x4): Vector2;
    /**
     * Transform helper
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): Vector2;
    /**
     * Get rotation angle in radians
     */
    angle(): number;
    /**
     * Get rotation angle in degrees
     */
    angleDegrees(): number;
    /**
     * Get rotation angle in radians
     */
    angleRadians(): number;
    /**
     * get min vector components
     * @param p
     */
    min(p: Vector2): Vector2;
    /**
     * get max vector components
     * @param p
     */
    max(p: Vector2): Vector2;
    /**
     * To String helper
     */
    toString(): string;
    /**
     * Module of a vector
     */
    abs(): Vector2;
}
//# sourceMappingURL=Vector2.d.ts.map