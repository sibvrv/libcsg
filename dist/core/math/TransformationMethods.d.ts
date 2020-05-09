import { Matrix4x4, Plane, TVector3Universal } from '.';
/**
 * Extra Transformation Methods
 */
export declare abstract class TransformationMethods {
    abstract transform(mat: Matrix4x4): any;
    mirrored(plane: Plane): any;
    mirroredX(): any;
    mirroredY(): any;
    mirroredZ(): any;
    translate(v: TVector3Universal): any;
    scale(f: TVector3Universal): any;
    rotateX(deg: number): any;
    rotateY(deg: number): any;
    rotateZ(deg: number): any;
    rotate(rotationCenter: any, rotationAxis: any, degrees: number): any;
    rotateEulerAngles(alpha: number, beta: number, gamma: number, position: TVector3Universal): any;
    rotateEulerXYZ(alpha: number, beta: number, gamma: number, position: TVector3Universal): any;
}
//# sourceMappingURL=TransformationMethods.d.ts.map