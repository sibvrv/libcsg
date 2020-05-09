import { Line3D, Matrix4x4, TransformationMethods, TVector3Universal, Vector3 } from '.';
export declare class Plane extends TransformationMethods {
    normal: Vector3;
    w: number;
    tag?: number;
    static fromObject<T extends Plane | {
        normal: TVector3Universal;
        w?: number | string;
    }>(obj: T): Plane;
    static fromVector3Ds(a: Vector3, b: Vector3, c: Vector3): Plane;
    static anyPlaneFromVector3Ds(a: Vector3, b: Vector3, c: Vector3): Plane;
    static fromPoints(_a: TVector3Universal, _b: TVector3Universal, _c: TVector3Universal): Plane;
    static fromNormalAndPoint(_normal: TVector3Universal, _point: TVector3Universal): Plane;
    constructor(normal: Vector3, w: number);
    flipped(): Plane;
    getTag(): number;
    equals(n: Plane): boolean;
    transform(matrix4x4: Matrix4x4): Plane;
    splitLineBetweenPoints(p1: Vector3, p2: Vector3): Vector3;
    intersectWithLine(line3d: Line3D): Vector3;
    intersectWithPlane(plane: Plane): Line3D;
    signedDistanceToPoint(point: Vector3): number;
    toString(): string;
    mirrorPoint(point3d: Vector3): Vector3;
}
//# sourceMappingURL=Plane.d.ts.map