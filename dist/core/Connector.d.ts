import { Line3D, Matrix4x4, TransformationMethods, TVector3Universal, Vector3 } from '@core/math';
/**
 * A connector allows to attach two objects at predefined positions
 * For example a servo motor and a servo horn:
 * Both can have a Connector called 'shaft'
 * The horn can be moved and rotated such that the two connectors match
 * and the horn is attached to the servo motor at the proper position.
 * Connectors are stored in the properties of a CSG solid so they are
 * ge the same transformations applied as the solid
 */
export declare class Connector extends TransformationMethods {
    point: Vector3;
    axisvector: Vector3;
    normalvector: Vector3;
    /**
     * Connector Constructor
     */
    constructor(point: TVector3Universal, axisvector: TVector3Universal, normalvector: TVector3Universal);
    /**
     * get normalized Connector
     */
    normalized(): Connector;
    /**
     * Transform helper
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): Connector;
    /**
     * Get the transformation matrix to connect this Connector to another connector
     * other: a Connector to which this connector should be connected
     * @param other
     * @param mirror -
     *    false: the 'axis' vectors of the connectors should point in the same direction
     *     true: the 'axis' vectors of the connectors should point in opposite direction
     * @param normalrotation - degrees of rotation between the 'normal' vectors of the two connectors
     */
    getTransformationTo(other: Connector, mirror: boolean, normalrotation: number): Matrix4x4;
    /**
     * Axis Line
     */
    axisLine(): Line3D;
    /**
     * creates a new Connector, with the connection point moved in the direction of the axisvector
     * @param distance
     */
    extend(distance: number): Connector;
}
//# sourceMappingURL=Connector.d.ts.map