import { Line2D, Line3D, Matrix4x4, Plane, TransformationMethods, TVector3Universal, Vector2, Vector3 } from '.';
/**
 * Reprojects points on a 3D plane onto a 2D plane
 * or from a 2D plane back onto the 3D plane
 * @param  {Plane} plane
 * @param  {Vector3D|Vector2D} rightvector
 *
 * @class OrthoNormalBasis
 */
export declare class OrthoNormalBasis extends TransformationMethods {
    v: Vector3;
    u: Vector3;
    plane: Plane;
    planeorigin: Vector3;
    /**
     * Get an orthonormal basis for the standard XYZ planes.
     * Parameters: the names of two 3D axes. The 2d x axis will map to the first given 3D axis, the 2d y
     * axis will map to the second.
     *
     * Prepend the axis with a "-" to invert the direction of this axis.
     * For example: OrthoNormalBasis.GetCartesian("-Y","Z")
     * will return an orthonormal basis where the 2d X axis maps to the 3D inverted Y axis, and
     * the 2d Y axis maps to the 3D Z axis.
     * @param xaxisid
     * @param yaxisid
     * @constructor
     */
    static GetCartesian(xaxisid: string, yaxisid: string): OrthoNormalBasis;
    /**
     * The z=0 plane, with the 3D x and y vectors mapped to the 2D x and y vector
     * @constructor
     */
    static Z0Plane(): OrthoNormalBasis;
    /**
     * OrthoNormalBasis Constructor
     */
    constructor(plane: Plane, _rightvector?: TVector3Universal);
    /**
     * Get projection matrix
     */
    getProjectionMatrix(): Matrix4x4;
    /**
     * Get inverse projection matrix
     */
    getInverseProjectionMatrix(): Matrix4x4;
    /**
     * to Vector2
     * @param vec3
     */
    to2D(vec3: Vector3): Vector2;
    /**
     * to Vector3
     * @param vec2
     */
    to3D(vec2: Vector2): Vector3;
    /**
     * Line 3D to 2D
     * @param line3d
     */
    line3Dto2D(line3d: Line3D): Line2D;
    /**
     * Line 2D to 3D
     * @param line2d
     */
    line2Dto3D(line2d: Line2D): Line3D;
    /**
     * Transform helper
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): OrthoNormalBasis;
}
//# sourceMappingURL=OrthoNormalBasis.d.ts.map