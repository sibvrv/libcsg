/** Create a polygon from the given points.
 *
 * @param {Array[]} points - list of points
 * @param {Polygon.Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 *
 * @example
 * const points = [
 *   [0,  0, 0],
 *   [0, 10, 0],
 *   [0, 10, 10]
 * ]
 * let polygon = CSG.Polygon.createFromPoints(points)
 */
export declare const fromPoints: (points: number[][], shared: any, plane?: any) => any;
//# sourceMappingURL=polygon3Factories.d.ts.map