/**
 * Center the given object(s) about the given axes
 * @param {Array|Boolean} axes=[true,true,true]|true  - an array of boolean values that indicate the axes (X,Y,Z) to center upon. A single boolean is also allowed.
 * @param {...Object} object one or more objects to center, i.e. objects are CSG or CAG
 * @returns {CSG} new CSG object , translated by the given amount
 *
 * @example
 * let csg = center([true,false,false], sphere()) // center about the X axis
 */
export declare function center(axes: any, ...objects: any[]): any;
//# sourceMappingURL=center.d.ts.map