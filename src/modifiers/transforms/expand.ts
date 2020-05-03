/** expand an object in 2D/3D space
 * @param {float} radius - the radius to expand by
 * @param {Object} object a CSG/CAG objects to expand
 * @returns {CSG/CAG} new CSG/CAG object , expanded
 *
 * @example
 * let expanededShape = expand([0.2,15,1], sphere())
 */
export function expand(radius: number, n: any, object: any) {
  return object.expand(radius, n);
}
