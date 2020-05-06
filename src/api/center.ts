import {CSG} from '../core/CSG';
import {CAG} from '../core/CAG';

/**
 * Center Options Interface
 */
export interface ICenterOptions {
  axes: [boolean, boolean, boolean];
  center: [number, number, number];
}

// TODO : Add addition 'methods' of centering; midpoint, centeriod
/**
 * Center Default Values
 */
const defaults: ICenterOptions = {
  axes: [true, true, true],
  center: [0, 0, 0],
};

/**
 * Centers the given object(s) using the given options (if any)
 * @param {Object} [options] - options for centering
 * @param {Array} [options.axes=[true,true,true]] - axis of which to center, true or false
 * @param {Array} [options.center=[0,0,0]] - point of which to center the object upon
 * @param {Object|Array} objects - the shape(s) to center
 * @return {Object|Array} objects
 *
 * @example
 * let csg = center({axes: [true,false,false]}, sphere()) // center about the X axis
 */
export const center = (options: Partial<ICenterOptions>, objects: CAG | CSG | (CAG | CSG)[]) => {
  objects = Array.isArray(objects) ? objects : [objects];
  options = {...defaults, ...options};

  const {axes, center: [centerX, centerY, centerZ]} = options as ICenterOptions;

  const results = objects.map((object) => {
    const bounds = object.getBounds();
    const offset = [0, 0, 0];

    if (axes[0]) offset[0] = centerX - (bounds[0].x + ((bounds[1].x - bounds[0].x) / 2));
    if (axes[1]) offset[1] = centerY - (bounds[0].y + ((bounds[1].y - bounds[0].y) / 2));
    if (axes[2]) offset[2] = centerZ - (bounds[0].z + ((bounds[1].z - bounds[0].z) / 2));

    return object.translate(offset);
  });

  // if there is more than one result, return them all , otherwise a single one
  return results.length === 1 ? results[0] : results;
};

