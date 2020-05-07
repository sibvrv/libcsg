import {OrthoNormalBasis} from '../../core/math/OrthoNormalBasis';
import {parseOptionAsBool} from '../../api/optionParsers';

/** extrude the CAG in a certain plane.
 * Giving just a plane is not enough, multiple different extrusions in the same plane would be possible
 * by rotating around the plane's origin. An additional right-hand vector should be specified as well,
 * and this is exactly a OrthoNormalBasis.
 * @param  {CAG} cag the cag to extrude
 * @param  {Orthonormalbasis} orthonormalbasis characterizes the plane in which to extrude
 * @param  {Float} depth thickness of the extruded shape. Extrusion is done upwards from the plane
 *  (unless symmetrical option is set, see below)
 * @param  {Object} [options] - options for construction
 * @param {Boolean} [options.symmetrical=true] - extrude symmetrically in two directions about the plane
 */
export const extrudeInOrthonormalBasis = (cag: any, orthonormalbasis: any, depth: number, options: any) => {
  // first extrude in the regular Z plane:
  if (!(orthonormalbasis instanceof OrthoNormalBasis)) {
    throw new Error('extrudeInPlane: the first parameter should be a OrthoNormalBasis');
  }
  let extruded = cag.extrude({
    offset: [0, 0, depth],
  });
  if (parseOptionAsBool(options, 'symmetrical', false)) {
    extruded = extruded.translate([0, 0, -depth / 2]);
  }
  const matrix = orthonormalbasis.getInverseProjectionMatrix();
  extruded = extruded.transform(matrix);
  return extruded;
};
