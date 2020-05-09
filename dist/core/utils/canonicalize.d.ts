import { CSG } from '../CSG';
import { CAG } from '../CAG';
/**
 * Returns a cannoicalized version of the input csg/cag : ie every very close
 * points get deduplicated
 * @returns {CSG|CAG}
 * @example
 * let rawInput = someCSGORCAGMakingFunction()
 * let canonicalized = canonicalize(rawInput)
 */
declare function canonicalize(csg: CSG, options?: any): CSG;
declare function canonicalize(cag: CAG, options?: any): CAG;
export { canonicalize };
//# sourceMappingURL=canonicalize.d.ts.map