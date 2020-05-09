import { Matrix4x4, TransformationMethods, Vector3 } from '.';
export declare type TVector2Universal = Vector2 | Vector3 | [number, number] | number[] | {
    x?: number | string;
    y?: number | string;
};
/**
 * Class Vector2
 * Represents a 2D vector with X, Y coordinates
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
    static fromAngle(radians: number): Vector2;
    static fromAngleDegrees(degrees: number): Vector2;
    static fromAngleRadians(radians: number): Vector2;
    static Create(x: number, y: number): Vector2;
    constructor(x?: number | string | TVector2Universal, y?: number | string);
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    toVector3D(z?: number): Vector3;
    equals(a: Vector2): boolean;
    clone(): Vector2;
    negated(): Vector2;
    plus(a: Vector2): Vector2;
    minus(a: Vector2): Vector2;
    times(a: number): Vector2;
    dividedBy(a: number): Vector2;
    dot(a: Vector2): number;
    lerp(a: Vector2, t: number): Vector2;
    length(): number;
    distanceTo(a: Vector2): number;
    distanceToSquared(a: Vector2): number;
    lengthSquared(): number;
    unit(): Vector2;
    cross(a: Vector2): number;
    normal(): Vector2;
    multiply4x4(matrix4x4: Matrix4x4): Vector2;
    transform(matrix4x4: Matrix4x4): Vector2;
    angle(): number;
    angleDegrees(): number;
    angleRadians(): number;
    min(p: Vector2): Vector2;
    max(p: Vector2): Vector2;
    toString(): string;
    abs(): Vector2;
}
//# sourceMappingURL=Vector2.d.ts.map