import { Plane, TVector3Universal, Vector2, Vector3 } from '.';
export declare class Matrix4x4 {
    elements: number[];
    static unity(): Matrix4x4;
    static rotationX(degrees: number): Matrix4x4;
    static rotationY(degrees: number): Matrix4x4;
    static rotationZ(degrees: number): Matrix4x4;
    static rotation(_rotationCenter: TVector3Universal, _rotationAxis: TVector3Universal, degrees: number): Matrix4x4;
    static translation(v: TVector3Universal): Matrix4x4;
    static mirroring(plane: Plane): Matrix4x4;
    static scaling(v: TVector3Universal): Matrix4x4;
    constructor(elements?: number[]);
    plus(m: Matrix4x4): Matrix4x4;
    minus(m: Matrix4x4): Matrix4x4;
    multiply(m: Matrix4x4): Matrix4x4;
    clone(): Matrix4x4;
    rightMultiply1x3Vector(v: Vector3): Vector3;
    leftMultiply1x3Vector(v: Vector3): Vector3;
    rightMultiply1x2Vector(v: Vector2): Vector2;
    leftMultiply1x2Vector(v: Vector2): Vector2;
    isMirroring(): boolean;
}
//# sourceMappingURL=Matrix4.d.ts.map