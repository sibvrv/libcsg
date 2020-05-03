const OrthoNormalBasis = require('../../core/math/OrthoNormalBasis');
import {extrudeInOrthonormalBasis} from './extrudeInOrthonormalBasis';

/** Extrude in a standard cartesian plane, specified by two axis identifiers. Each identifier can be
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
export const extrudeInPlane = (cag: any, axis1: any, axis2: any, depth: number, options: any) => {
  return extrudeInOrthonormalBasis(cag, OrthoNormalBasis.GetCartesian(axis1, axis2), depth, options);
};
