const {union} = require('../booleans');
import {hull} from './hull';

/** create a chain hull of the given shapes
 * Originally "Whosa whatsis" suggested "Chain Hull" ,
 * as described at https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN
 * essentially hull A+B, B+C, C+D and then union those
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to create a chain hull around
 * @returns {CSG} new CSG object ,which a chain hull of the inputs
 *
 * @example
 * let hulled = chain_hull(rect(), circle())
 */
export function chain_hull(params: any, objects: any) {
  /*
  const defaults = {
    closed: false
  }
  const closed = Object.assign({}, defaults, params) */
  let a = arguments;
  let closed = false;
  let j = 0;

  if (a[j].closed !== undefined) {
    closed = a[j++].closed;
  }

  if (a[j].length) {
    a = a[j];
  }

  const hulls = [];
  const hullsAmount = a.length - (closed ? 0 : 1);
  for (let i = 0; i < hullsAmount; i++) {
    hulls.push(hull(a[i], a[(i + 1) % a.length]));
  }
  return union(hulls);
}
