import { Polygon3 } from '@core/math';
import { CSG } from '@core/CSG';
/**
 * Construct a CSG solid from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {CSG} new CSG object
 */
export declare const fromPolygons: (polygons: Polygon3[]) => CSG;
/**
 * Reconstruct a CSG solid from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CSG} new CSG object
 */
export declare function fromObject(obj: any): CSG;
/**
 * Reconstruct a CSG from the output of toCompactBinary().
 * @param {CompactBinary} bin - see toCompactBinary().
 * @returns {CSG} new CSG object
 */
export declare function fromCompactBinary(bin: any): CSG;
//# sourceMappingURL=CSGFactories.d.ts.map