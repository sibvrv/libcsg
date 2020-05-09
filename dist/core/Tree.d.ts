import { Polygon3 } from '@core/math';
import { PolygonTreeNode } from '@core/PolygonTreeNode';
import { Node } from '@core/Node';
export declare class Tree {
    polygonTree: PolygonTreeNode;
    rootnode: Node;
    /**
     * Tree Constructor
     */
    constructor(polygons?: Polygon3[]);
    invert(): void;
    clipTo(tree: Tree, alsoRemovecoplanarFront?: boolean): void;
    allPolygons(): Polygon3[];
    addPolygons(polygons: Polygon3[]): void;
}
//# sourceMappingURL=Tree.d.ts.map