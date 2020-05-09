import { Matrix4x4, TransformationMethods, TVector3Universal, Vector2, Vector3 } from '.';
export declare class Vertex3 extends TransformationMethods {
    pos: Vector3;
    uv: Vector2;
    tag?: number;
    static fromObject(obj: {
        pos: TVector3Universal;
    }): Vertex3;
    static fromPosAndUV(pos: Vector3, uv: Vector2): Vertex3;
    constructor(pos: Vector3);
    flipped(): this;
    getTag(): number;
    interpolate(other: Vertex3, t: number): Vertex3;
    transform(matrix4x4: Matrix4x4): Vertex3;
    toString(): string;
}
//# sourceMappingURL=Vertex3.d.ts.map