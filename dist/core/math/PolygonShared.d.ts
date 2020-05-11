/**
 * Class Polygon.Shared
 * Holds the shared properties for each polygon (Currently only color).
 * @constructor
 * @param {Array[]} color - array containing RGBA values, or null
 *
 * @example
 *   let shared = new CSG.Polygon.Shared([0, 0, 0, 1])
 */
export declare class PolygonShared {
    color: [number, number, number, number];
    tag?: number;
    /**
     * make from object
     * @param obj
     */
    static fromObject(obj: any): PolygonShared;
    /**
     * Create Polygon.Shared from color values.
     * @param {number} r - value of RED component
     * @param {number} g - value of GREEN component
     * @param {number} b - value of BLUE component
     * @param {number} [a] - value of ALPHA component
     * @param {Array[]} [color] - OR array containing RGB values (optional Alpha)
     *
     * @example
     * let s1 = Polygon.Shared.fromColor(0,0,0)
     * let s2 = Polygon.Shared.fromColor([0,0,0,1])
     */
    static fromColor(...args: any[]): PolygonShared;
    /**
     * PolygonShared Constructor
     */
    constructor(color?: [number, number, number, number] | null);
    /**
     * get Tag
     */
    getTag(): number;
    /**
     * get a string uniquely identifying this object
     */
    getHash(): string;
}
//# sourceMappingURL=PolygonShared.d.ts.map