import { Plane, Polygon3 } from '@core/math';
export declare class PolygonTreeNode {
    parent: PolygonTreeNode | null;
    children: PolygonTreeNode[];
    polygon: Polygon3 | null;
    removed: boolean;
    addPolygons(polygons: Polygon3[]): void;
    remove(): void;
    isRemoved(): boolean;
    isRootNode(): boolean;
    invert(): void;
    getPolygon(): Polygon3;
    getPolygons(result: Polygon3[]): void;
    splitByPlane(plane: Plane, coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]): void;
    _splitByPlane(plane: Plane, coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]): void;
    addChild(polygon: Polygon3): PolygonTreeNode;
    invertSub(): void;
    recursivelyInvalidatePolygon(): void;
}
//# sourceMappingURL=PolygonTreeNode.d.ts.map