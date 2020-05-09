import { Matrix4x4, Plane, TransformationMethods, TVector3Universal, Vector3 } from '.';
export declare class Line3D extends TransformationMethods {
    point: Vector3;
    direction: Vector3;
    static fromPoints(_p1: TVector3Universal, _p2: TVector3Universal): Line3D;
    static fromPlanes(p1: Plane, p2: Plane): Line3D;
    /**
     * Line3D Constructor
     */
    constructor(point: TVector3Universal, direction: TVector3Universal);
    intersectWithPlane(plane: Plane): Vector3;
    clone(line: Line3D): Line3D;
    reverse(): Line3D;
    transform(matrix4x4: Matrix4x4): Line3D;
    closestPointOnLine(_point: TVector3Universal): Vector3;
    distanceToPoint(_point: TVector3Universal): number;
    equals(line3d: Line3D): boolean;
}
//# sourceMappingURL=Line3.d.ts.map