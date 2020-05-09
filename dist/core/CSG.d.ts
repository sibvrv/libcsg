import { Line2D, Line3D, Matrix4x4, OrthoNormalBasis, Path2D, Plane, Polygon2D, Polygon3, PolygonShared, TransformationMethods, TVector3Universal, Vector2, Vector3, Vertex3 } from './math';
import { Properties } from './Properties';
import { fromCompactBinary, fromObject, fromSlices } from './CSGFactories';
import { Connector } from './Connector';
import { ConnectorList } from './ConnectorList';
/**
 * Class CSG
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 * @constructor
 */
export declare class CSG extends TransformationMethods {
    polygons: Polygon3[];
    properties: Properties;
    isCanonicalized: boolean;
    isRetesselated: boolean;
    cachedBoundingBox?: [Vector3, Vector3];
    /**
     * Return a new CSG solid representing the space in either this solid or
     * in the given solids. Neither this solid nor the given solids are modified.
     * @param {CSG[]} csg - list of CSG objects
     * @returns {CSG} new CSG object
     * @example
     * let C = A.union(B)
     * @example
     * +-------+            +-------+
     * |       |            |       |
     * |   A   |            |       |
     * |    +--+----+   =   |       +----+
     * +----+--+    |       +----+       |
     *      |   B   |            |       |
     *      |       |            |       |
     *      +-------+            +-------+
     */
    union(csg: CSG | CSG[]): CSG;
    unionSub(csg: CSG, retesselate?: boolean, canonicalize?: boolean): CSG;
    unionForNonIntersecting(csg: CSG): CSG;
    /**
     * Return a new CSG solid representing space in this solid but
     * not in the given solids. Neither this solid nor the given solids are modified.
     * @param {CSG[]} csg - list of CSG objects
     * @returns {CSG} new CSG object
     * @example
     * let C = A.subtract(B)
     * @example
     * +-------+            +-------+
     * |       |            |       |
     * |   A   |            |       |
     * |    +--+----+   =   |    +--+
     * +----+--+    |       +----+
     *      |   B   |
     *      |       |
     *      +-------+
     */
    subtract(csg: CSG | CSG[]): CSG;
    subtractSub(csg: CSG, retesselate?: boolean, canonicalize?: boolean): CSG;
    /**
     * Return a new CSG solid representing space in both this solid and
     * in the given solids. Neither this solid nor the given solids are modified.
     * @param {CSG[]} csg - list of CSG objects
     * @returns {CSG} new CSG object
     * @example
     * let C = A.intersect(B)
     * @example
     * +-------+
     * |       |
     * |   A   |
     * |    +--+----+   =   +--+
     * +----+--+    |       +--+
     *      |   B   |
     *      |       |
     *      +-------+
     */
    intersect(csg: CSG | CSG[]): CSG;
    intersectSub(csg: CSG, retesselate?: boolean, canonicalize?: boolean): CSG;
    /**
     * Return a new CSG solid with solid and empty space switched.
     * This solid is not modified.
     * @returns {CSG} new CSG object
     * @example
     * let B = A.invert()
     */
    invert(): CSG;
    transform1(matrix4x4: Matrix4x4): CSG;
    /**
     * Return a new CSG solid that is transformed using the given Matrix.
     * Several matrix transformations can be combined before transforming this solid.
     * @param {CSG.Matrix4x4} matrix4x4 - matrix to be applied
     * @returns {CSG} new CSG object
     * @example
     * var m = new CSG.Matrix4x4()
     * m = m.multiply(CSG.Matrix4x4.rotationX(40))
     * m = m.multiply(CSG.Matrix4x4.translation([-.5, 0, 0]))
     * let B = A.transform(m)
     */
    transform(matrix4x4: Matrix4x4): CSG;
    center(axes: [boolean, boolean, boolean]): any;
    expand(radius: number, resolution: number): any;
    contract(radius: number, resolution: number): any;
    expandedShell(radius: number, resolution: number, unionWithThis?: boolean): any;
    stretchAtPlane(normal: TVector3Universal, point: TVector3Universal, length: number): CSG;
    canonicalized(): CSG;
    reTesselated(): CSG;
    fixTJunctions(): any;
    getBounds(): [Vector3, Vector3];
    /**
     * Returns true if there is a possibility that the two solids overlap
     * returns false if we can be sure that they do not overlap
     * NOTE: this is critical as it is used in UNIONs
     * @param  {CSG} csg
     */
    mayOverlap(csg: CSG): boolean;
    cutByPlane(plane: Plane): CSG;
    /**
     * Connect a solid to another solid, such that two Connectors become connected
     * @param  {Connector} myConnector a Connector of this solid
     * @param  {Connector} otherConnector a Connector to which myConnector should be connected
     * @param  {Boolean} mirror false: the 'axis' vectors of the connectors should point in the same direction
     * true: the 'axis' vectors of the connectors should point in opposite direction
     * @param  {Float} normalrotation degrees of rotation between the 'normal' vectors of the two
     * connectors
     * @returns {CSG} this csg, tranformed accordingly
     */
    connectTo(myConnector: Connector, otherConnector: Connector, mirror: boolean, normalrotation: number): CSG;
    /**
     * set the .shared property of all polygons
     * @param  {Object} shared
     * @returns {CSG} Returns a new CSG solid, the original is unmodified!
     */
    setShared(shared: PolygonShared): CSG;
    /**
     * sets the color of this csg: non mutating, returns a new CSG
     * @param  {Object} args
     * @returns {CSG} a copy of this CSG, with the given color
     */
    setColor(...args: any[]): CSG;
    getTransformationAndInverseTransformationToFlatLying(): (Matrix4x4 | undefined)[];
    getTransformationToFlatLying(): any;
    lieFlat(): any;
    projectToOrthoNormalBasis(orthobasis: OrthoNormalBasis): import("./CAG").CAG;
    sectionCut(orthobasis: OrthoNormalBasis): import("./CAG").CAG;
    /**
     * Returns an array of values for the requested features of this solid.
     * Supported Features: 'volume', 'area'
     * @param {string[]} inFeatures - list of features to calculate
     * @returns {number[]} values
     * @example
     * let volume = A.getFeatures('volume')
     * let values = A.getFeatures('area','volume')
     */
    getFeatures(inFeatures: string | string[]): any;
    /**
     * @return {Polygon[]} The list of polygons.
     */
    toPolygons(): Polygon3[];
    toString(): string;
    /**
     * Returns a compact binary representation of this csg
     * usually used to transfer CSG objects to/from webworkes
     * NOTE: very interesting compact format, with a lot of reusable ideas
     * @returns {Object} compact binary representation of a CSG
     */
    toCompactBinary(): {
        class: string;
        numPolygons: number;
        numVerticesPerPolygon: Uint32Array;
        polygonPlaneIndexes: Uint32Array;
        polygonSharedIndexes: Uint32Array;
        polygonVertices: Uint32Array;
        vertexData: Float64Array;
        planeData: Float64Array;
        shared: PolygonShared[];
    };
    /**
     * Returns the triangles of this csg
     * @returns {Polygon3[]} triangulated polygons
     */
    toTriangles(): Polygon3[];
    static Vector2D: typeof Vector2;
    static Vector3D: typeof Vector3;
    static Vertex: typeof Vertex3;
    static Plane: typeof Plane;
    static Polygon: typeof Polygon3;
    static Polygon2D: typeof Polygon2D;
    static Line2D: typeof Line2D;
    static Line3D: typeof Line3D;
    static Path2D: typeof Path2D;
    static OrthoNormalBasis: typeof OrthoNormalBasis;
    static Matrix4x4: typeof Matrix4x4;
    static Connector: typeof Connector;
    static ConnectorList: typeof ConnectorList;
    static Properties: typeof Properties;
    static _CSGDEBUG: boolean;
    static defaultResolution2D: number;
    static defaultResolution3D: number;
    static EPS: number;
    static angleEPS: number;
    static areaEPS: number;
    static all: number;
    static top: number;
    static bottom: number;
    static left: number;
    static right: number;
    static front: number;
    static back: number;
    static staticTag: number;
    static getTag: () => number;
    static sphere: (options?: any) => CSG;
    static cube: (options?: any) => CSG;
    static roundedCube: (options?: any) => CSG;
    static cylinder: (options?: any) => CSG;
    static roundedCylinder: (options?: any) => CSG;
    static cylinderElliptic: (options?: any) => CSG;
    static polyhedron: (options: any) => CSG;
    static fromCompactBinary: typeof fromCompactBinary;
    static fromObject: typeof fromObject;
    static fromSlices: typeof fromSlices;
    static fromPolygons: (polygons: Polygon3[]) => CSG;
    static parseOptionAs2DVector: (options: any, optionname: string, defaultvalue: any) => any;
    static parseOptionAs3DVector: (options: any, optionname: string, defaultvalue: any) => any;
    static parseOptionAs3DVectorList: (options: any, optionname: string, defaultvalue: any) => any;
    static parseOptionAsBool: (options: any, optionname: string, defaultvalue: any) => any;
    static parseOptionAsFloat: (options: any, optionname: string, defaultvalue: any) => number;
    static parseOptionAsInt: (options: any, optionname: string, defaultvalue: any) => any;
}
//# sourceMappingURL=CSG.d.ts.map