import { Matrix4x4, TransformationMethods, Vector2 } from '.';
export declare type TVector3Universal = Vector3 | Vector2 | {
    x?: number | string;
    y?: number | string;
    z?: number | string;
} | [number, number, number] | number[];
/**
 * Class Vector3
 * Represents a 3D vector with X, Y, Z coordinates.
 * @constructor
 *
 * @example
 * new CSG.Vector3(1, 2, 3);
 * new CSG.Vector3([1, 2, 3]);
 * new CSG.Vector3({ x: 1, y: 2, z: 3 });
 * new CSG.Vector3(1, 2); // assumes z=0
 * new CSG.Vector3([1, 2]); // assumes z=0
 */
export declare class Vector3 extends TransformationMethods {
    _x: number;
    _y: number;
    _z: number;
    /**
     * Make Vector3
     * This does the same as new Vector3(x,y,z) but it doesn't go through the constructor
     * and the parameters are not validated. Is much faster.
     * @param x
     * @param y
     * @param z
     * @constructor
     */
    static Create(x: number, y: number, z: number): Vector3;
    /**
     * Vector3 Constructor
     */
    constructor(x?: number | string | TVector3Universal, y?: number | string, z?: number | string);
    /**
     * Set X is not allowed. Vector3 is immutable
     * @param v
     */
    set x(v: number);
    /**
     * Get X component
     */
    get x(): number;
    /**
     * Set Y is not allowed. Vector3 is immutable
     * @param v
     */
    set y(v: number);
    /**
     * Get Y component
     */
    get y(): number;
    /**
     * Set Z is not allowed. Vector3 is immutable
     * @param v
     */
    set z(v: number);
    /**
     * get Z component
     */
    get z(): number;
    /**
     * Clone Vector3
     */
    clone(): Vector3;
    /**
     * Get negated vector
     */
    negated(): Vector3;
    /**
     * get module
     */
    abs(): Vector3;
    /**
     * Plus
     * @param a
     */
    plus(a: Vector3): Vector3;
    /**
     * Minus
     * @param a
     */
    minus(a: Vector3): Vector3;
    /**
     * scale this vector by scalar and return a new vector
     * @param a
     */
    times(a: number): Vector3;
    /**
     * divide this vector by scalar and return a new vector
     * @param a
     */
    dividedBy(a: number): Vector3;
    /**
     * Find The Dot Product Of Two Vectors
     * @param a
     */
    dot(a: Vector3): number;
    /**
     * Lerp
     * @param a
     * @param t
     */
    lerp(a: Vector3, t: number): Vector3;
    /**
     * get Squared Length
     */
    lengthSquared(): number;
    /**
     * Get Length
     */
    length(): number;
    /**
     * Get Unit Vector
     */
    unit(): Vector3;
    /**
     * Cross Product
     * @param a
     */
    cross(a: Vector3): Vector3;
    /**
     * Distance to point
     * @param a
     */
    distanceTo(a: Vector3): number;
    /**
     * Squared distance to point
     * @param a
     */
    distanceToSquared(a: Vector3): number;
    /**
     * is Vector Equals
     * @param a
     */
    equals(a: Vector3): boolean;
    /**
     * Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
     * Returns a new Vector3
     * @param matrix4x4
     */
    multiply4x4(matrix4x4: Matrix4x4): Vector3;
    /**
     * Transform helper
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): Vector3;
    /**
     * To string helper
     */
    toString(): string;
    /**
     * find a vector that is somewhat perpendicular to this one
     */
    randomNonParallelVector(): Vector3;
    /**
     * get min vector components
     * @param p
     */
    min(p: Vector3): Vector3;
    /**
     * get max vector components
     * @param p
     */
    max(p: Vector3): Vector3;
}
//# sourceMappingURL=Vector3.d.ts.map