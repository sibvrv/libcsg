import { CAG } from '@core/CAG';
/**
 * Construct a polygon either from arrays of paths and points,
 * or just arrays of points nested paths (multiple paths) and flat paths are supported
 * @param {Object} [options] - options for construction or either flat or nested array of points
 * @param {Array} [options.points] - points of the polygon : either flat or nested array of points
 * @param {Array} [options.paths] - paths of the polygon : either flat or nested array of points index
 * @returns {CAG} new polygon
 *
 * @example
 * let roof = [[10,11], [0,11], [5,20]]
 * let wall = [[0,0], [10,0], [10,10], [0,10]]
 *
 * let poly = polygon(roof)
 * or
 * let poly = polygon([roof, wall])
 * or
 * let poly = polygon({ points: roof })
 * or
 * let poly = polygon({ points: [roof, wall] })
 * or
 * let poly = polygon({ points: roof, path: [0, 1, 2] })
 * or
 * let poly = polygon({ points: [roof, wall], path: [[0, 1, 2], [3, 4, 5, 6]] })
 * or
 * let poly = polygon({ points: roof.concat(wall), paths: [[0, 1, 2], [3, 4, 5], [3, 6, 5]] })
 */
export declare function polygon(params: any): CAG;
//# sourceMappingURL=polygon.d.ts.map