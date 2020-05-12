import { Polygon3 } from '@core/math';
import { PolygonTreeNode } from '@core/tree/PolygonTreeNode';
import { Node } from '@core/tree/Node';
import { ITree } from '@core/tree/treeTypes';
/**
 * @class Tree
 * This is the root of a BSP tree
 * We are using this separate class for the root of the tree, to hold the PolygonTreeNode root
 * The actual tree is kept in this.rootnode
 */
export declare class Tree implements ITree {
    polygonTree: PolygonTreeNode;
    rootnode: Node;
    /**
     * Tree Constructor
     */
    constructor(polygons?: Polygon3[]);
    /**
     * Invert
     */
    invert(): void;
    /**
     * Remove all polygons in this BSP tree that are inside the other BSP tree
     * `tree`.
     * @param tree
     * @param alsoRemoveCoplanarFront
     */
    clipTo(tree: Tree, alsoRemoveCoplanarFront?: boolean): void;
    /**
     * All Polygons
     */
    allPolygons(): Polygon3[];
    /**
     * Add Polygons
     * @param polygons
     */
    addPolygons(polygons: Polygon3[]): void;
}
//# sourceMappingURL=Tree.d.ts.map