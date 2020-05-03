/**
 * Convex Hull
 * from http://www.psychedelicdevelopment.com/grahamscan/
 * see also at https://github.com/bkiers/GrahamScan/blob/master/src/main/cg/GrahamScan.java
 */
export declare class ConvexHull {
    points: any[];
    indices: number[];
    getIndices(): number[];
    clear(): void;
    ccw(p1: number, p2: number, p3: number): number;
    angle(o: number, a: number): number;
    distance(a: number, b: number): number;
    compute(_points: any[]): void;
}
//# sourceMappingURL=ConvexHull.d.ts.map