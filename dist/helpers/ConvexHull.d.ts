/**
 * Convex Hull
 * from http://www.psychedelicdevelopment.com/grahamscan/
 * see also at https://github.com/bkiers/GrahamScan/blob/master/src/main/cg/GrahamScan.java
 * @class ConvexHull
 */
export declare class ConvexHull {
    points: any[];
    indices: number[];
    /**
     * Get Indices
     */
    getIndices(): number[];
    /**
     * Clear
     */
    clear(): void;
    /**
     * CCW
     * @param p1
     * @param p2
     * @param p3
     */
    ccw(p1: number, p2: number, p3: number): number;
    /**
     * Angle
     * @param o
     * @param a
     */
    angle(o: number, a: number): number;
    /**
     * Distance
     * @param a
     * @param b
     */
    distance(a: number, b: number): number;
    /**
     * Compute
     * @param _points
     */
    compute(_points: any[]): void;
}
//# sourceMappingURL=ConvexHull.d.ts.map