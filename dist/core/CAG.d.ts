import { Matrix4x4, OrthoNormalBasis, Polygon3, Side, TransformationMethods, Vector2, Vector3, Vertex2 } from './math';
import { IRotateExtrude } from '@modifiers/extrusions/';
/**
 * Holds a solid area geometry like CSG but 2D.
 * Each area consists of a number of sides.
 * Each side is a line between 2 points.
 * @class CAG
 * @constructor
 */
export declare class CAG extends TransformationMethods {
    sides: Side[];
    isCanonicalized: boolean;
    /**
     * Union
     * @param cag
     */
    union(cag: CAG | CAG[]): CAG;
    /**
     * Subtract
     * @param cag
     */
    subtract(cag: CAG | CAG[]): CAG;
    /**
     * Intersect
     * @param cag
     */
    intersect(cag: CAG | CAG[]): CAG;
    /**
     * Transform helper
     * @param matrix4x4
     */
    transform(matrix4x4: Matrix4x4): CAG;
    /**
     * get Flipped
     */
    flipped(): CAG;
    /**
     * Center
     * @alias center
     * @param axes
     */
    center(axes: [boolean, boolean, boolean]): CAG | CAG[];
    /**
     * Expanded Shell
     * @alias expandedShellOfCAG
     * @param radius
     * @param resolution
     */
    expandedShell(radius: number, resolution: number): CAG;
    /**
     * Expand
     * @alias expand
     * @param radius
     * @param resolution
     */
    expand(radius: number, resolution: number): any;
    /**
     * Contract
     * @alias contract
     * @param radius
     * @param resolution
     */
    contract(radius: number, resolution: number): any;
    /**
     * get Area
     * @alias area
     */
    area(): number;
    /**
     * get Bounds
     * @alias getBounds
     */
    getBounds(): any[];
    /**
     * Is self intersecting
     * @alias isSelfIntersecting
     * @param debug
     */
    isSelfIntersecting(debug?: boolean): boolean;
    /**
     * Extrude In OrthonormalBasis
     * extrusion: all aliases to simple functions
     * @alias extrudeInOrthonormalBasis
     * @param orthonormalbasis
     * @param depth
     * @param options
     */
    extrudeInOrthonormalBasis(orthonormalbasis: OrthoNormalBasis, depth: number, options?: any): any;
    /**
     * Extrude In Plane
     * @alias extrudeInPlane
     * @param axis1
     * @param axis2
     * @param depth
     * @param options
     */
    extrudeInPlane(axis1: string, axis2: string, depth: number, options: any): any;
    /**
     * Extrude
     * @alias extrude
     * @param options
     */
    extrude(options?: any): import("./CSG").CSG;
    /**
     * Rotate Extrude
     * @alias rotateExtrude
     * @param options
     */
    rotateExtrude(options?: Partial<IRotateExtrude>): import("./CSG").CSG;
    /**
     * Check
     * @alias isCAGValid
     */
    check(): void;
    /**
     * Canonicalized
     * @alias canonicalize
     */
    canonicalized(): CAG;
    /**
     * reTessellated
     * @alias reTessellate
     */
    reTesselated(): import("./CSG").CSG;
    /**
     * getOutlinePaths
     * @alias cagOutlinePaths
     */
    getOutlinePaths(): import("./math").Path2D[];
    /**
     * Over Cut Inside Corners
     * @alias overCutInsideCorners
     * @param cutterradius
     */
    overCutInsideCorners(cutterradius: number): any;
    /**
     * Has Point Inside
     * @param point
     */
    hasPointInside(point: Vector2): boolean;
    /**
     * To String helper
     */
    toString(): string;
    /**
     * _toCSGWall
     * @param z0
     * @param z1
     * @private
     */
    _toCSGWall(z0: number, z1: number): import("./CSG").CSG;
    /**
     * _toVector3DPairs
     * @param m
     * @private
     */
    _toVector3DPairs(m: Matrix4x4): Vector3[][];
    /**
     * _toPlanePolygons
     * transform a cag into the polygons of a corresponding 3d plane, positioned per options
     * Accepts a connector for plane positioning, or optionally
     * single translation, axisVector, normalVector arguments
     * (toConnector has precedence over single arguments if provided)
     * @param options
     * @private
     */
    _toPlanePolygons(options: any): Polygon3[];
    /**
     * _toWallPolygons
     * given 2 connectors, this returns all polygons of a "wall" between 2
     * copies of this cag, positioned in 3d space as "bottom" and
     * "top" plane per connectors toConnector1, and toConnector2, respectively
     * @param options
     * @param iteration
     * @private
     */
    _toWallPolygons(options: any, iteration?: number): Polygon3[];
    /**
     * Convert to a list of points.
     * @return {points[]} list of points in 2D space
     */
    toPoints(): Vector2[];
    /**
     * Convert to compact binary form.
     * See fromCompactBinary.
     * @return {CompactBinary}
     */
    toCompactBinary(): {
        class: string;
        sideVertexIndices: Uint32Array;
        vertexData: Float64Array;
    };
    static Vertex: typeof Vertex2;
    static Side: typeof Side;
    static circle: (options?: Partial<import("../primitives/csg/primitives2d").ICircleOptions>) => CAG;
    static ellipse: (options?: Partial<import("../primitives/csg/primitives2d").IEllipse>) => CAG;
    static rectangle: (options?: Partial<import("../primitives/csg/primitives2d").IRectangle>) => CAG;
    static roundedRectangle: (options?: Partial<import("../primitives/csg/primitives2d").IRoundedRectangleNormal & import("../primitives/csg/primitives2d").IRoundedRectangle> | Partial<import("../primitives/csg/primitives2d").IRoundedRectangleCorner & import("../primitives/csg/primitives2d").IRoundedRectangle>) => CAG;
    static fromSides: (sides: Side[]) => CAG;
    static fromObject: (obj: any) => CAG;
    static fromPoints: (points: any) => CAG;
    static fromPointsNoCheck: (points: any) => CAG;
    static fromPath2: (path: any) => CAG;
    static fromFakeCSG: (csg: import("./CSG").CSG) => CAG;
    static fromCompactBinary: (bin: any) => CAG;
}
//# sourceMappingURL=CAG.d.ts.map