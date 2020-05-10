import {isCAG} from '@core/utils/utils';

/**
 * Difference / Subtraction of the given shapes ie:
 * cut out C From B From A ie : a - b - c etc
 * @param {Object(s)|Array} objects - objects to subtract
 * can be given
 * - one by one: difference(a,b,c) or
 * - as an array: difference([a,b,c])
 * @returns {CSG} new CSG object, the difference of all input shapes
 *
 * @example
 * let differenceOfSphereAndCube = difference(sphere(), cube())
 */
export const difference = (...objects: any[]) => {
  let object;
  let i = 0;
  let a = objects;
  if (a[0].length) a = a[0];
  for (object = a[i++]; i < a.length; i++) {
    if (isCAG(a[i])) {
      object = object.subtract(a[i]);
    } else {
      object = object.subtract(a[i].setColor(1, 1, 0)); // -- color the cuts
    }
  }
  return object;
};
