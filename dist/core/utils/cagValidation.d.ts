export declare const isCAGValid: (CAG: any) => void;
export declare const isSelfIntersecting: (cag: any, debug?: boolean | undefined) => boolean;
/** Check if the point stay inside the CAG shape
 * ray-casting algorithm based on :
 * https://github.com/substack/point-in-polygon/blob/master/index.js
 * http://www.ecse.rp1.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * originaly writed for https://github.com/lautr3k/SLAcer.js/blob/dev/js/slacer/slicer.js#L82
 * @param {CAG} cag - CAG object
 * @param {Object} p0 - Vertex2 like object
 * @returns {Boolean}
 */
export declare const hasPointInside: {
    (cag: any, p0: any): boolean;
    c1(p0: any, p1: any, p2: any): boolean;
    c2(p0: any, p1: any, p2: any): boolean;
};
/** Check if all points from one CAG stay inside another CAG
 * @param {CAG} cag1 - CAG object
 * @param {Object} cag2 - CAG object
 * @returns {Boolean}
 */
export declare const contains: (cag1: any, cag2: any) => boolean;
//# sourceMappingURL=cagValidation.d.ts.map