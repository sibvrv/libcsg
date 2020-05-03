/** intersection of the given shapes: ie keep only the common parts between the given shapes
 * @param {Object(s)|Array} objects - objects to intersect
 * can be given
 * - one by one: intersection(a,b,c) or
 * - as an array: intersection([a,b,c])
 * @returns {CSG} new CSG object, the intersection of all input shapes
 *
 * @example
 * let intersectionOfSphereAndCube = intersection(sphere(), cube())
 */
export declare const intersection: (...objects: any[]) => any;
//# sourceMappingURL=intersection.d.ts.map