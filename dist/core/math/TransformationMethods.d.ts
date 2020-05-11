import { Matrix4x4, Plane, TVector3Universal } from '.';
/**
 * Extra Transformation Methods
 */
export declare abstract class TransformationMethods {
    /**
     * Transform helper
     * @abstract
     * @param mat
     */
    abstract transform(mat: Matrix4x4): any;
    /**
     * Get Mirrored
     * @param plane
     */
    mirrored(plane: Plane): any;
    /**
     * Get Mirrored - X
     */
    mirroredX(): any;
    /**
     * Get Mirrored - Y
     */
    mirroredY(): any;
    /**
     * Get Mirrored - Z
     */
    mirroredZ(): any;
    /**
     * Translate
     * @param v
     */
    translate(v: TVector3Universal): any;
    /**
     * Scale
     * @param f
     */
    scale(f: TVector3Universal): any;
    /**
     * Rotate - X
     * @param deg
     */
    rotateX(deg: number): any;
    /**
     * Rotate - Y
     * @param deg
     */
    rotateY(deg: number): any;
    /**
     * Rotate - Z
     * @param deg
     */
    rotateZ(deg: number): any;
    /**
     * Rotate
     * @param rotationCenter
     * @param rotationAxis
     * @param degrees
     */
    rotate(rotationCenter: any, rotationAxis: any, degrees: number): any;
    /**
     * Rotate Euler Angles
     * @param alpha
     * @param beta
     * @param gamma
     * @param position
     */
    rotateEulerAngles(alpha: number, beta: number, gamma: number, position: TVector3Universal): any;
    /**
     * Rotate Euler XYZ
     * @param alpha
     * @param beta
     * @param gamma
     * @param position
     */
    rotateEulerXYZ(alpha: number, beta: number, gamma: number, position: TVector3Universal): any;
}
//# sourceMappingURL=TransformationMethods.d.ts.map