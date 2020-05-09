import { Line2D, Line3D, Matrix4x4, Plane, TransformationMethods, TVector3Universal, Vector2, Vector3 } from '.';
/**
 * class OrthoNormalBasis
 * Reprojects points on a 3D plane onto a 2D plane
 * or from a 2D plane back onto the 3D plane
 * @param  {Plane} plane
 * @param  {Vector3D|Vector2D} rightvector
 */
export declare class OrthoNormalBasis extends TransformationMethods {
    v: Vector3;
    u: Vector3;
    plane: Plane;
    planeorigin: Vector3;
    static GetCartesian(xaxisid: string, yaxisid: string): OrthoNormalBasis;
    static Z0Plane(): OrthoNormalBasis;
    /**
     * OrthoNormalBasis Constructor
     */
    constructor(plane: Plane, _rightvector?: TVector3Universal);
    getProjectionMatrix(): Matrix4x4;
    getInverseProjectionMatrix(): Matrix4x4;
    to2D(vec3: Vector3): Vector2;
    to3D(vec2: Vector2): Vector3;
    line3Dto2D(line3d: Line3D): Line2D;
    line2Dto3D(line2d: Line2D): Line3D;
    transform(matrix4x4: Matrix4x4): OrthoNormalBasis;
}
//# sourceMappingURL=OrthoNormalBasis.d.ts.map