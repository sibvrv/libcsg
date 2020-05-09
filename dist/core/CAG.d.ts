import { Matrix4x4, OrthoNormalBasis, Polygon3, Side, TransformationMethods, Vector2, Vector3, Vertex2 } from './math';
import { IRotateExtrude } from '@modifiers/extrusions/rotateExtrude';
/**
 * Class CAG
 * Holds a solid area geometry like CSG but 2D.
 * Each area consists of a number of sides.
 * Each side is a line between 2 points.
 * @constructor
 */
export declare class CAG extends TransformationMethods {
    sides: Side[];
    isCanonicalized: boolean;
    union(cag: CAG | CAG[]): CAG;
    subtract(cag: CAG | CAG[]): CAG;
    intersect(cag: CAG | CAG[]): CAG;
    transform(matrix4x4: Matrix4x4): CAG;
    flipped(): CAG;
    center(axes: [boolean, boolean, boolean]): any;
    expandedShell(radius: number, resolution: number): CAG;
    expand(radius: number, resolution: number): any;
    contract(radius: number, resolution: number): any;
    area(): number;
    getBounds(): any[];
    isSelfIntersecting(debug?: boolean): boolean;
    extrudeInOrthonormalBasis(orthonormalbasis: OrthoNormalBasis, depth: number, options?: any): any;
    extrudeInPlane(axis1: string, axis2: string, depth: number, options: any): any;
    extrude(options?: any): import("./CSG").CSG;
    rotateExtrude(options?: Partial<IRotateExtrude>): import("./CSG").CSG;
    check(): void;
    canonicalized(): CAG;
    reTesselated(): any;
    getOutlinePaths(): import("./math").Path2D[];
    overCutInsideCorners(cutterradius: number): any;
    hasPointInside(point: Vector2): boolean;
    toString(): string;
    _toCSGWall(z0: number, z1: number): import("./CSG").CSG;
    _toVector3DPairs(m: Matrix4x4): Vector3[][];
    _toPlanePolygons(options: any): Polygon3[];
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
    static circle: (options?: any) => CAG;
    static ellipse: (options?: any) => CAG;
    static rectangle: (options?: any) => CAG;
    static roundedRectangle: (options?: any) => CAG;
    static fromSides: (sides: Side[]) => CAG;
    static fromObject: (obj: any) => CAG;
    static fromPoints: (points: any) => CAG;
    static fromPointsNoCheck: (points: any) => CAG;
    static fromPath2: (path: any) => CAG;
    static fromFakeCSG: (csg: import("./CSG").CSG) => CAG;
    static fromCompactBinary: (bin: any) => CAG;
}
//# sourceMappingURL=CAG.d.ts.map