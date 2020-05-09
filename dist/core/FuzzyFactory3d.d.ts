import { Plane, Polygon3, PolygonShared, Vertex3 } from './math';
import { FuzzyFactory } from './FuzzyFactory';
export declare class FuzzyCSGFactory {
    vertexfactory: FuzzyFactory;
    planefactory: FuzzyFactory;
    polygonsharedfactory: {
        [hash: string]: PolygonShared;
    };
    getPolygonShared(sourceshared: PolygonShared): PolygonShared;
    getVertex(sourcevertex: Vertex3): any;
    getPlane(sourceplane: Plane): any;
    getPolygon(sourcepolygon: Polygon3): Polygon3;
}
//# sourceMappingURL=FuzzyFactory3d.d.ts.map