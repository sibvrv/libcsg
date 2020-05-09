import { Polygon3 } from './math';
import { PolygonTreeNode } from './PolygonTreeNode';
import { Node } from './Node';
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