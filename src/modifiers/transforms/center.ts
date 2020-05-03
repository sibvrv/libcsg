/**
 * Center the given object(s) about the given axes
 * @param {Array|Boolean} axes=[true,true,true]|true  - an array of boolean values that indicate the axes (X,Y,Z) to center upon. A single boolean is also allowed.
 * @param {...Object} object one or more objects to center, i.e. objects are CSG or CAG
 * @returns {CSG} new CSG object , translated by the given amount
 *
 * @example
 * let csg = center([true,false,false], sphere()) // center about the X axis
 */
export function center(axes: any, ...objects: any[]) {
  const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects;
  let object = _objects[0];

  if (_objects.length > 1) {
    for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
      object = object.union(_objects[i]);
    }
  }
  if (!Array.isArray(axes)) {
    axes = [axes, axes, axes];
  }
  return object.center(axes);
}
