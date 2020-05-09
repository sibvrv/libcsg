/**
 * Apply the given color to the input object(s)
 * @param {Object} colorValue - either an array or a hex string of color values
 * @param {Object|Array} objects either a single or multiple CSG/CAG objects to color
 * @returns {CSG} new CSG object , with the given color
 *
 * @example
 * let redSphere = color([1,0,0,1], sphere())
 */
export declare const color: (colorValue: string | number[], ...objects: any[]) => any;
//# sourceMappingURL=color.d.ts.map