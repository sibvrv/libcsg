/** contract an object(s) in 2D/3D space
 * @param {float} radius - the radius to contract by
 * @param {Object} object a CSG/CAG objects to contract
 * @returns {CSG/CAG} new CSG/CAG object , contracted
 *
 * @example
 * let contractedShape = contract([0.2,15,1], sphere())
 */
export function contract(radius: number, n: any, object: any) {
  return object.contract(radius, n);
}
