import { Matrix4x4, Polygon3, TransformationMethods, Vector2, Vertex2 } from '.';
/**
 * Side
 * @class Side
 */
export declare class Side extends TransformationMethods {
    vertex0: Vertex2;
    vertex1: Vertex2;
    tag?: number;
    /**
     * make from object
     * @param obj
     */
    static fromObject(obj: Side): Side;
    /**
     * from fake polygon
     * @param polygon
     * @private
     */
    static _fromFakePolygon(polygon: Polygon3): Side | null;
    /**
     * Side Constructor
     * @param vertex0
     * @param vertex1
     */
    constructor(vertex0: Vertex2, vertex1: Vertex2);
    /**
     * To String Helper
     */
    toString(): string;
    /**
     * Convert to Polygon3
     * @param z0
     * @param z1
     */
    toPolygon3D(z0: number, z1: number): Polygon3;
    /**
     * Transform helper
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): Side;
    /**
     * Get Flipped side
     */
    flipped(): Side;
    /**
     * Get Direction
     */
    direction(): Vector2;
    /**
     * Get Tag
     */
    getTag(): number;
    /**
     * Length Squared
     */
    lengthSquared(): number;
    /**
     * Get Length
     */
    length(): number;
}
//# sourceMappingURL=Side.d.ts.map