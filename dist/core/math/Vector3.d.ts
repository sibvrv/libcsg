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
    static Create(x: number, y: number, z: number): Vector3;
    /**
     * Vector3 Constructor
     */
    constructor(x?: number | string | TVector3Universal, y?: number | string, z?: number | string);
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set z(v: number);
    get z(): number;
    clone(): Vector3;
    negated(): Vector3;
    abs(): Vector3;
    plus(a: Vector3): Vector3;
    minus(a: Vector3): Vector3;
    times(a: number): Vector3;
    dividedBy(a: number): Vector3;
    dot(a: Vector3): number;
    lerp(a: Vector3, t: number): Vector3;
    lengthSquared(): number;
    length(): number;
    unit(): Vector3;
    cross(a: Vector3): Vector3;
    distanceTo(a: Vector3): number;
    distanceToSquared(a: Vector3): number;
    equals(a: Vector3): boolean;
    multiply4x4(matrix4x4: Matrix4x4): Vector3;
    transform(matrix4x4: Matrix4x4): Vector3;
    toString(): string;
    randomNonParallelVector(): Vector3;
    min(p: Vector3): Vector3;
    max(p: Vector3): Vector3;
}
//# sourceMappingURL=Vector3.d.ts.map