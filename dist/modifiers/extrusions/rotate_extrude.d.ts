/** rotate extrusion / revolve of the given 2d shape
 * @param {Object} [options] - options for construction
 * @param {Integer} [options.fn=1] - resolution/number of segments of the extrusion
 * @param {Float} [options.startAngle=1] - start angle of the extrusion, in degrees
 * @param {Float} [options.angle=1] - angle of the extrusion, in degrees
 * @param {Float} [options.overflow='cap'] - what to do with points outside of bounds (+ / - x) :
 * defaults to capping those points to 0 (only supported behaviour for now)
 * @param {CAG} baseShape input 2d shape
 * @returns {CSG} new extruded shape
 *
 * @example
 * let revolved = rotate_extrude({fn: 10}, square())
 */
export declare function rotate_extrude(params?: any, baseShape?: any): any;
//# sourceMappingURL=rotate_extrude.d.ts.map