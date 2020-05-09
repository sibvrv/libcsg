import { Matrix4x4, Polygon3, TransformationMethods, Vector2, Vertex2 } from '.';
export declare class Side extends TransformationMethods {
    vertex0: Vertex2;
    vertex1: Vertex2;
    tag?: number;
    static fromObject(obj: Side): Side;
    static _fromFakePolygon(polygon: Polygon3): Side | null;
    constructor(vertex0: Vertex2, vertex1: Vertex2);
    toString(): string;
    toPolygon3D(z0: number, z1: number): Polygon3;
    transform(matrix4x4: Matrix4x4): Side;
    flipped(): Side;
    direction(): Vector2;
    getTag(): number;
    lengthSquared(): number;
    length(): number;
}
//# sourceMappingURL=Side.d.ts.map