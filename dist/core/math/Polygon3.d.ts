import { CAG } from '../CAG';
import { ISolidFromSlices } from '../../api/solidFromSlices';
import { Matrix4x4, OrthoNormalBasis, Plane, PolygonShared, TransformationMethods, TVector3Universal, Vector3, Vertex3 } from '.';
/**
 * Class Polygon
 * Represents a convex polygon. The vertices used to initialize a polygon must
 *   be coplanar and form a convex loop. They do not have to be `Vertex`
 *   instances but they must behave similarly (duck typing can be used for
 *   customization).
 * <br>
 * Each convex polygon has a `shared` property, which is shared between all
 *   polygons that are clones of each other or were split from the same polygon.
 *   This can be used to define per-polygon properties (such as surface color).
 * <br>
 * The plane of the polygon is calculated from the vertex coordinates if not provided.
 *   The plane can alternatively be passed as the third argument to avoid calculations.
 *
 * @constructor
 * @param {Vertex[]} vertices - list of vertices
 * @param {Polygon3.Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 *
 * @example
 * const vertices = [
 *   new CSG.Vertex(new CSG.Vector3([0, 0, 0])),
 *   new CSG.Vertex(new CSG.Vector3([0, 10, 0])),
 *   new CSG.Vertex(new CSG.Vector3([0, 10, 10]))
 * ]
 * let observed = new Polygon(vertices)
 */
export declare class Polygon3 extends TransformationMethods {
    vertices: Vertex3[];
    shared: PolygonShared;
    plane: Plane;
    cachedBoundingBox?: [Vector3, Vector3];
    cachedBoundingSphere?: [Vector3, number];
    static defaultShared: PolygonShared;
    static Shared: typeof PolygonShared;
    static fromObject<T extends Polygon3 | {
        vertices: Vertex3[];
        shared?: PolygonShared;
        plane?: Plane;
    }>(obj: T): Polygon3;
    /**
     * Create a polygon from the given points.
     *
     * @param {Array[]} points - list of points
     * @param {Polygon3.Shared} [shared=defaultShared] - shared property to apply
     * @param {Plane} [plane] - plane of the polygon
     *
     * @example
     * const points = [
     *   [0,  0, 0],
     *   [0, 10, 0],
     *   [0, 10, 10]
     * ]
     * let observed = CSG.Polygon3.createFromPoints(points)
     */
    static createFromPoints(points: TVector3Universal[], shared?: PolygonShared, plane?: Plane): Polygon3;
    static verticesConvex(vertices: Vertex3[], planenormal: Vector3): boolean;
    static isConvexPoint(prevpoint: Vector3, point: Vector3, nextpoint: Vector3, normal: Vector3): boolean;
    static isStrictlyConvexPoint(prevpoint: Vector3, point: Vector3, nextpoint: Vector3, normal: Vector3): boolean;
    /**
     * Polygon3 Constructor
     */
    constructor(vertices: Vertex3[], shared?: PolygonShared | null, plane?: Plane);
    /**
     * Check whether the polygon is convex. (it should be, otherwise we will get unexpected results)
     * @returns {boolean}
     */
    checkIfConvex(): boolean;
    setColor(...args: any[]): this;
    getSignedVolume(): number;
    getArea(): number;
    getTetraFeatures(features: string[]): number[];
    extrude(offsetvector: Vector3): import("../CSG").CSG;
    translate(offset: TVector3Universal): Polygon3;
    boundingSphere(): [Vector3, number];
    boundingBox(): [Vector3, Vector3];
    flipped(): Polygon3;
    transform(matrix4x4: Matrix4x4): Polygon3;
    toString(): string;
    projectToOrthoNormalBasis(orthobasis: OrthoNormalBasis): CAG;
    solidFromSlices(options: Partial<ISolidFromSlices>): import("../CSG").CSG;
}
//# sourceMappingURL=Polygon3.d.ts.map