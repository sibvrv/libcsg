import { CSG } from '@core/CSG';
/**
 * Create the expanded shell of the solid:
 * All faces are extruded to get a thickness of 2*radius
 * Cylinders are constructed around every side
 * Spheres are placed on every vertex
 * unionWithThis: if true, the resulting solid will be united with 'this' solid;
 * the result is a true expansion of the solid
 * If false, returns only the shell
 * @param  {Float} radius
 * @param  {Integer} resolution
 * @param  {Boolean} unionWithThis
 */
export declare const expandedShellOfCCSG: (_csg: CSG, radius: number, resolution: number, unionWithThis?: boolean | undefined) => any;
//# sourceMappingURL=expandedShellOfCCSG.d.ts.map