import { Plane, Vector3 } from '@core/math';
import { Tree } from '@core/Tree';
import { PolygonTreeNode } from '@core/PolygonTreeNode';
/**
 * @class Node
 * Holds a node in a BSP tree. A BSP tree is built from a collection of polygons
 * by picking a polygon to split along.
 * Polygons are not stored directly in the tree, but in PolygonTreeNodes, stored in
 * this.polygontreenodes. Those PolygonTreeNodes are children of the owning
 * Tree.polygonTree
 * This is not a leafy BSP tree since there is
 * no distinction between internal and leaf nodes.
 */
export declare class Node {
    parent: Node | null;
    plane: Plane | null;
    front: Node | null;
    back: Node | null;
    polygontreenodes: never[];
    /**
     * Node Constructor
     */
    constructor(parent: Node | null);
    /**
     * Convert solid space to empty space and empty space to solid space.
     */
    invert(): void;
    /**
     * clip polygontreenodes to our plane
     * calls remove() for all clipped PolygonTreeNodes
     * @param polygontreenodes
     * @param alsoRemovecoplanarFront
     */
    clipPolygons(polygontreenodes: PolygonTreeNode[], alsoRemovecoplanarFront?: boolean): void;
    /**
     * Remove all polygons in this BSP tree that are inside the other BSP tree
     * `tree`.
     * @param tree
     * @param alsoRemovecoplanarFront
     */
    clipTo(tree: Tree, alsoRemovecoplanarFront?: boolean): void;
    /**
     * Add Polygon Tree Nodes
     * @param polygontreenodes
     */
    addPolygonTreeNodes(polygontreenodes: PolygonTreeNode[]): void;
    /**
     * Get Parent Plane Normals
     * @param normals
     * @param maxdepth
     */
    getParentPlaneNormals(normals: Vector3[], maxdepth: number): void;
}
//# sourceMappingURL=Node.d.ts.map