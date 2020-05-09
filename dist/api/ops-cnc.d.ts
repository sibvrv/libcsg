import { CSG } from '../core/CSG';
import { Matrix4x4 } from '../core/math';
export declare const getTransformationAndInverseTransformationToFlatLying: (_csg: CSG) => (Matrix4x4 | undefined)[];
export declare const getTransformationToFlatLying: (csg: any) => any;
export declare const lieFlat: (csg: any) => any;
/**
 * cag = cag.overCutInsideCorners(cutterradius);
 * Using a CNC router it's impossible to cut out a true sharp inside corner. The inside corner
 * will be rounded due to the radius of the cutter. This function compensates for this by creating
 * an extra cutout at each inner corner so that the actual cut out shape will be at least as large
 * as needed.
 * @param {Object} _cag - input cag
 * @param {Float} cutterradius - radius to cut inside corners by
 * @returns {CAG} cag with overcutInsideCorners
 */
export declare const overCutInsideCorners: (_cag: any, cutterradius: number) => any;
//# sourceMappingURL=ops-cnc.d.ts.map