import { Plane, Polygon3, PolygonShared, Vertex3 } from '@core/math';
import { FuzzyFactory } from '@core/FuzzyFactory';
/**
 * Class FuzzyCSGFactory
 */
export declare class FuzzyCSGFactory {
    vertexfactory: FuzzyFactory;
    planefactory: FuzzyFactory;
    polygonsharedfactory: {
        [hash: string]: PolygonShared;
    };
    /**
     * Get Polygon Shared
     * @param sourceshared
     */
    getPolygonShared(sourceshared: PolygonShared): PolygonShared;
    /**
     * Get Vertex
     * @param sourcevertex
     */
    getVertex(sourcevertex: Vertex3): any;
    /**
     * Get Plane
     * @param sourceplane
     */
    getPlane(sourceplane: Plane): any;
    /**
     * Get Polygon
     * @param sourcepolygon
     */
    getPolygon(sourcepolygon: Polygon3): Polygon3;
}
//# sourceMappingURL=FuzzyFactory3d.d.ts.map