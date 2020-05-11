import { CSG } from '@core/CSG';
import { CAG } from '@core/CAG';
import { OrthoNormalBasis } from '@core/math';
/**
 * Project the 3D CSG onto a plane
 * This returns a 2D CAG with the 'shadow' shape of the 3D solid when projected onto the
 * plane represented by the orthonormal basis
 * @param csg
 * @param orthobasis
 */
export declare const projectToOrthoNormalBasis: (csg: CSG, orthobasis: OrthoNormalBasis) => CAG;
//# sourceMappingURL=csgProjections.d.ts.map