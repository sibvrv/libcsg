import {css2rgb} from './css2rgb';

// color( (array[r,g,b] | css-string) [,alpha] (,array[objects] | list of objects) )

/** apply the given color to the input object(s)
 * @param {Object} colorValue - either an array or a hex string of color values
 * @param {Object|Array} objects either a single or multiple CSG/CAG objects to color
 * @returns {CSG} new CSG object , with the given color
 *
 * @example
 * let redSphere = color([1,0,0,1], sphere())
 */
export const color = (colorValue: string | number[], ...objects: any[]) => {
  let object;
  let i = 1;
  let a = objects;

  // assume first argument is RGB array
  // but check if first argument is CSS string
  if (typeof colorValue === 'string') {
    colorValue = css2rgb(colorValue);
  }

  // check if second argument is alpha
  if (Number.isFinite(a[i])) {
    colorValue = colorValue.concat(a[i]);
    i++;
  }

  // check if next argument is an an array
  if (Array.isArray(a[i])) {
    a = a[i];
    i = 0;
  } // use this as the list of objects

  for (object = a[i++]; i < a.length; i++) {
    object = object.union(a[i]);
  }

  return object.setColor(colorValue);
}
