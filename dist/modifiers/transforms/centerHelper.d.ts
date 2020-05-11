import { CSG } from '@core/CSG';
import { CAG } from '@core/CAG';
/**
 * Center Options Interface
 */
export interface ICenterOptions {
    axes: [boolean, boolean, boolean];
    center: [number, number, number];
}
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
export declare const centerHelper: <ObjectType extends CAG | CSG>(options: Partial<ICenterOptions>, objects: ObjectType | ObjectType[]) => ObjectType | ObjectType[];
//# sourceMappingURL=centerHelper.d.ts.map