import { CAG } from '@core/CAG';
/**
 * Extrude in a standard cartesian plane, specified by two axis identifiers. Each identifier can be
 * one of ["X","Y","Z","-X","-Y","-Z"]
 * The 2d x axis will map to the first given 3D axis, the 2d y axis will map to the second.
 * See OrthoNormalBasis.GetCartesian for details.
 * @param  {CAG} cag the cag to extrude
 * @param  {String} axis1 the first axis
 * @param  {String} axis2 the second axis
 * @param  {Float} depth thickness of the extruded shape. Extrusion is done upwards from the plane
 * @param  {Object} [options] - options for construction
 * @param {Boolean} [options.symmetrical=true] - extrude symmetrically in two directions about the plane
 */
export declare const extrudeInPlane: (cag: CAG, axis1: string, axis2: string, depth: number, options: any) => any;
//# sourceMappingURL=extrudeInPlane.d.ts.map