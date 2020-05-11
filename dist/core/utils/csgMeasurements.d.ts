import { Vector3 } from '@core/math';
import { CSG } from '@core/CSG';
/**
 * Returns an array of Vector3D, providing minimum coordinates and maximum coordinates
 * of this solid.
 * @returns {Vector3D[]}
 * @example
 * let bounds = A.getBounds()
 * let minX = bounds[0].x
 */
export declare const bounds: (csg: CSG) => [Vector3, Vector3];
/**
 * Get CSG Volume
 * @param csg
 */
export declare const volume: (csg: CSG) => any[];
/**
 * Get CSG Area
 * @param csg
 */
export declare const area: (csg: CSG) => any[];
//# sourceMappingURL=csgMeasurements.d.ts.map