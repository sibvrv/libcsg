import { Plane, Polygon3 } from '@core/math';
/**
 * Split Polygon By Plane
 * Returns object:
 *  .type:
 *   0: coplanar-front
 *   1: coplanar-back
 *   2: front
 *   3: back
 *   4: spanning
 * In case the polygon is spanning, returns:
 *   .front: a Polygon of the front part
 *   .back: a Polygon of the back part
 *
 * @param plane
 * @param polygon
 */
export declare function splitPolygonByPlane(plane: Plane, polygon: Polygon3): {
    type: number | null;
    front: Polygon3 | null;
    back: Polygon3 | null;
};
//# sourceMappingURL=splitPolygonByPlane.d.ts.map