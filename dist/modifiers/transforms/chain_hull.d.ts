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
export declare function chain_hull(params: any, objects: any): any;
//# sourceMappingURL=chain_hull.d.ts.map