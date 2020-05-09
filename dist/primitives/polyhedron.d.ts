import { CSG } from '@core/CSG';
/**
 * Construct a polyhedron from the given triangles/ polygons/points
 * @param {Object} [options] - options for construction
 * @param {Array} [options.triangles] - triangles to build the polyhedron from
 * @param {Array} [options.polygons] - polygons to build the polyhedron from
 * @param {Array} [options.points] - points to build the polyhedron from
 * @param {Array} [options.colors] - colors to apply to the polyhedron
 * @returns {CSG} new polyhedron
 *
 * @example
 * let torus1 = polyhedron({
 *   points: [...]
 * })
 */
export declare function polyhedron(params: any): CSG;
//# sourceMappingURL=polyhedron.d.ts.map