import { Polygon3 } from '@core/math';
export interface ISolidFromSlices {
    loop: boolean;
    numslices: number;
    callback: any;
}
/**
 * Creates solid from slices (Polygon) by generating walls
 * @param {Object} options Solid generating options
 *  - numslices {Number} Number of slices to be generated
 *  - callback(t, slice) {Function} Callback function generating slices.
 *          arguments: t = [0..1], slice = [0..numslices - 1]
 *          return: Polygon or null to skip
 *  - loop {Boolean} no flats, only walls, it's used to generate solids like a tor
 */
export declare const solidFromSlices: (polygon: Polygon3, options: Partial<ISolidFromSlices>) => import("../main").CSG;
//# sourceMappingURL=solidFromSlices.d.ts.map