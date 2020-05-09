import { Polygon3 } from './math';
import { CSG } from './CSG';
/**
 * Construct a CSG solid from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {CSG} new CSG object
 */
export declare const fromPolygons: (polygons: Polygon3[]) => CSG;
/**
 * Construct a CSG solid from a list of pre-generated slices.
 * See Polygon.prototype.solidFromSlices() for details.
 * @param {Object} options - options passed to solidFromSlices()
 * @returns {CSG} new CSG object
 */
export declare function fromSlices(options: any): CSG;
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