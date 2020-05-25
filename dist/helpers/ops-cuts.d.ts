import { OrthoNormalBasis, Plane } from '@core/math';
import { CSG } from '@core/CSG';
/**
 * cuts a csg along a orthobasis
 * @param  {CSG} csg the csg object to cut
 * @param  {Orthobasis} orthobasis the orthobasis to cut along
 */
export declare const sectionCut: (csg: CSG, orthobasis: OrthoNormalBasis) => import("../main").CAG;
/**
 * Cut the solid by a plane. Returns the solid on the back side of the plane
 * @param csg
 * @param {Plane} plane
 * @returns {CSG} the solid on the back side of the plane
 */
export declare const cutByPlane: (csg: CSG, plane: Plane) => CSG;
//# sourceMappingURL=ops-cuts.d.ts.map