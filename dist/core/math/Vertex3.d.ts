import { Matrix4x4, TransformationMethods, TVector3Universal, Vector2, Vector3 } from '.';
/**
 * Represents a vertex of a polygon. Use your own vertex class instead of this
 * one to provide additional features like texture coordinates and vertex
 * colors. Custom vertex classes need to provide a `pos` property
 * `flipped()`, and `interpolate()` methods that behave analogous to the ones
 * FIXME: And a lot MORE (see plane.fromVector3Ds for ex) ! This is fragile code
 * defined by `Vertex`.
 */
export declare class Vertex3 extends TransformationMethods {
    pos: Vector3;
    uv: Vector2;
    tag?: number;
    /**
     * create from an untyped object with identical property names:
     * @param obj
     */
    static fromObject(obj: {
        pos: TVector3Universal;
    }): Vertex3;
    /**
     * create with position and uv coordinates
     * @param pos
     * @param uv
     */
    static fromPosAndUV(pos: Vector3, uv: Vector2): Vertex3;
    /**
     * Vertex3 constructor
     * @param pos
     */
    constructor(pos: Vector3);
    /**
     * Return a vertex with all orientation-specific data (e.g. vertex normal) flipped. Called when the
     * orientation of a polygon is flipped.
     */
    flipped(): this;
    /**
     * Get Tag
     */
    getTag(): number;
    /**
     * Create a new vertex between this vertex and `other` by linearly
     * interpolating all properties using a parameter of `t`. Subclasses should
     * override this to interpolate additional properties.
     * @param other
     * @param t
     */
    interpolate(other: Vertex3, t: number): Vertex3;
    /**
     * Affine transformation of vertex. Returns a new Vertex
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): Vertex3;
    /**
     * To String helper
     */
    toString(): string;
}
//# sourceMappingURL=Vertex3.d.ts.map