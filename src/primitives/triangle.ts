import CAG from '../core/CAG';// we have to import from top level otherwise prototypes are not complete..
import {fromPoints} from '../core/CAGFactories';

// FIXME: errr this is kinda just a special case of a polygon , why do we need it ?
/** Construct a triangle
 * @returns {CAG} new triangle
 *
 * @example
 * let triangle = trangle({
 *   length: 10
 * })
 */
export function triangle() {
  let a = arguments;
  if (a[0] && a[0].length) a = a[0];
  return fromPoints(a);
}
