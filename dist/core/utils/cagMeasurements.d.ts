import { CAG } from '@core/CAG';
/**
 * Area of the polygon. For a counter clockwise rotating polygon the area is positive, otherwise negative
 * Note(bebbi): this looks wrong. See polygon getArea()
 * see http://local.wasp.uwa.edu.au/~pbourke/geometry/polyarea/ :
 * @param cag
 */
export declare const area: (cag: CAG) => number;
/**
 * Get CAG Bounds
 * @param cag
 */
export declare const getBounds: (cag: CAG) => any[];
//# sourceMappingURL=cagMeasurements.d.ts.map