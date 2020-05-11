import { Plane, TVector3Universal, Vector2, Vector3 } from '.';
/**
 * Represents a 4x4 matrix. Elements are specified in row order
 *
 * @class Matrix4x4
 */
export declare class Matrix4x4 {
    elements: number[];
    /**
     * Return the unity matrix
     */
    static unity(): Matrix4x4;
    /**
     * Create a rotation matrix for rotating around the x axis
     * @param degrees
     */
    static rotationX(degrees: number): Matrix4x4;
    /**
     * Create a rotation matrix for rotating around the y axis
     * @param degrees
     */
    static rotationY(degrees: number): Matrix4x4;
    /**
     * Create a rotation matrix for rotating around the z axis
     * @param degrees
     */
    static rotationZ(degrees: number): Matrix4x4;
    /**
     * Matrix for rotation about arbitrary point and axis
     * @param _rotationCenter
     * @param _rotationAxis
     * @param degrees
     */
    static rotation(_rotationCenter: TVector3Universal, _rotationAxis: TVector3Universal, degrees: number): Matrix4x4;
    /**
     * Create an affine matrix for translation:
     * @param v
     */
    static translation(v: TVector3Universal): Matrix4x4;
    /**
     * Create an affine matrix for mirroring into an arbitrary plane:
     * @param plane
     */
    static mirroring(plane: Plane): Matrix4x4;
    /**
     * Create an affine matrix for scaling:
     * @param v
     */
    static scaling(v: TVector3Universal): Matrix4x4;
    /**
     * Metrix4x4 Constructor
     * @param elements
     */
    constructor(elements?: number[]);
    /**
     * Plus
     * @param m
     */
    plus(m: Matrix4x4): Matrix4x4;
    /**
     * Minus
     * @param m
     */
    minus(m: Matrix4x4): Matrix4x4;
    /**
     * Right multiply by another 4x4 matrix:
     * @param m
     */
    multiply(m: Matrix4x4): Matrix4x4;
    /**
     * Clone
     */
    clone(): Matrix4x4;
    /**
     * Right multiply the matrix by a Vector3 (interpreted as 3 row, 1 column)
     * (result = M*v)
     * Fourth element is taken as 1
     * @param v
     */
    rightMultiply1x3Vector(v: Vector3): Vector3;
    /**
     * Multiply a Vector3 (interpreted as 3 column, 1 row) by this matrix
     * (result = v*M)
     * Fourth element is taken as 1
     * @param v
     */
    leftMultiply1x3Vector(v: Vector3): Vector3;
    /**
     * Right multiply the matrix by a Vector2 (interpreted as 2 row, 1 column)
     * (result = M*v)
     * Fourth element is taken as 1
     * @param v
     */
    rightMultiply1x2Vector(v: Vector2): Vector2;
    /**
     * Multiply a Vector2 (interpreted as 2 column, 1 row) by this matrix
     * (result = v*M)
     * Fourth element is taken as 1
     * @param v
     */
    leftMultiply1x2Vector(v: Vector2): Vector2;
    /**
     * Determine whether this matrix is a mirroring transformation
     */
    isMirroring(): boolean;
}
//# sourceMappingURL=Matrix4.d.ts.map