import { Line3D, Matrix4x4, TransformationMethods, TVector3Universal, Vector3 } from '@core/math';
export declare class Connector extends TransformationMethods {
    point: Vector3;
    axisvector: Vector3;
    normalvector: Vector3;
    /**
     * Connector Constructor
     */
    constructor(point: TVector3Universal, axisvector: TVector3Universal, normalvector: TVector3Universal);
    normalized(): Connector;
    transform(matrix4x4: Matrix4x4): Connector;
    getTransformationTo(other: Connector, mirror: boolean, normalrotation: number): Matrix4x4;
    axisLine(): Line3D;
    extend(distance: number): Connector;
}
//# sourceMappingURL=Connector.d.ts.map