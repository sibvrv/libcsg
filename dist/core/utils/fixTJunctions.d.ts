/**
 * Fix TJunctions
 *     Suppose we have two polygons ACDB and EDGF:
 *
 *     A-----B
 *     |     |
 *     |     E--F
 *     |     |  |
 *     C-----D--G
 *
 *     Note that vertex E forms a T-junction on the side BD. In this case some STL slicers will complain
 *     that the solid is not watertight. This is because the watertightness check is done by checking if
 *     each side DE is matched by another side ED.
 *
 *     This function will return a new solid with ACDB replaced by ACDEB
 *
 *     Note that this can create polygons that are slightly non-convex (due to rounding errors). Therefore the result should
 *     not be used for further CSG operations!
 *
 * @param fromPolygons
 * @param csg
 */
export declare const fixTJunctions: (fromPolygons: any, csg: any) => any;
//# sourceMappingURL=fixTJunctions.d.ts.map