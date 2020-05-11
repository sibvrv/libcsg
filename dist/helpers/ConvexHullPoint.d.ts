/**
 * Convex Hull Point
 * @class ConvexHullPoint
 */
export declare class ConvexHullPoint {
    index: number;
    angle: number;
    distance: number;
    /**
     * ConvexHullPoint Constructor
     * @param index
     * @param angle
     * @param distance
     */
    constructor(index: number, angle: number, distance: number);
    /**
     * Compare ConvexHullPoints
     * @param p
     */
    compare(p: ConvexHullPoint): number;
}
//# sourceMappingURL=ConvexHullPoint.d.ts.map