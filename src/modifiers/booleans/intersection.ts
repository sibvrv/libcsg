import {isCAG} from '@core/utils/utils';

/**
 * intersection of the given shapes: ie keep only the common parts between the given shapes
 * @param {Object(s)|Array} objects - objects to intersect
 * can be given
 * - one by one: intersection(a,b,c) or
 * - as an array: intersection([a,b,c])
 * @returns {CSG} new CSG object, the intersection of all input shapes
 *
 * @example
 * let intersectionOfSphereAndCube = intersection(sphere(), cube())
 */
export const intersection = (...objects: any[]) => {
  let object;
  let i = 0;
  let a = objects;
  if (a[0].length) a = a[0];
  for (object = a[i++]; i < a.length; i++) {
    if (isCAG(a[i])) {
      object = object.intersect(a[i]);
    } else {
      object = object.intersect(a[i].setColor(1, 1, 0)); // -- color the cuts
    }
  }
  return object;
};
