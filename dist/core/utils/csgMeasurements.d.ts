import { Vector3 } from '../math';
import { CSG } from '../CSG';
/**
 * Returns an array of Vector3D, providing minimum coordinates and maximum coordinates
 * of this solid.
 * @returns {Vector3D[]}
 * @example
 * let bounds = A.getBounds()
 * let minX = bounds[0].x
 */
export declare const bounds: (csg: CSG) => [Vector3, Vector3];
export declare const volume: (csg: CSG) => void;
export declare const area: (csg: CSG) => void;
//# sourceMappingURL=csgMeasurements.d.ts.map