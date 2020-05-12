import { Plane, Polygon3 } from '@core/math';
import { IPolygonTreeNode } from '@core/tree/treeTypes';
/**
 * @class PolygonTreeNode
 * This class manages hierarchical splits of polygons
 * At the top is a root node which doesn hold a polygon, only child PolygonTreeNodes
 * Below that are zero or more 'top' nodes; each holds a polygon. The polygons can be in different planes
 * splitByPlane() splits a node by a plane. If the plane intersects the polygon, two new child nodes
 * are created holding the splitted polygon.
 * getPolygons() retrieves the polygon from the tree. If for PolygonTreeNode the polygon is split but
 * the two split parts (child nodes) are still intact, then the unsplit polygon is returned.
 * This ensures that we can safely split a polygon into many fragments. If the fragments are untouched,
 * getPolygons() will return the original unsplit polygon instead of the fragments.
 * remove() removes a polygon from the tree. Once a polygon is removed, the parent polygons are invalidated
 * since they are no longer intact.
 * constructor creates the root node:
 */
export declare class PolygonTreeNode implements IPolygonTreeNode {
    parent: PolygonTreeNode | null;
    children: PolygonTreeNode[];
    polygon: Polygon3 | null;
    removed: boolean;
    /**
     * fill the tree with polygons. Should be called on the root node only; child nodes must
     * always be a derivate (split) of the parent node.
     * @param polygons
     */
    addPolygons(polygons: Polygon3[]): void;
    /**
     * remove a node
     * - the siblings become toplevel nodes
     * - the parent is removed recursively
     */
    remove(): void;
    /**
     * isRemoved
     */
    isRemoved(): boolean;
    /**
     * isRootNode
     */
    isRootNode(): boolean;
    /**
     * Invert
     * invert all polygons in the tree. Call on the root node
     */
    invert(): void;
    /**
     * Get Polygon
     */
    getPolygon(): Polygon3;
    /**
     * Get Polygons
     * @param result
     */
    getPolygons(result: Polygon3[]): void;
    /**
     * Split the node by a plane; add the resulting nodes to the frontnodes and backnodes array
     * If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays
     * If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,
     * and added to both arrays.
     * @param plane
     * @param coplanarfrontnodes
     * @param coplanarbacknodes
     * @param frontnodes
     * @param backnodes
     */
    splitByPlane(plane: Plane, coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]): void;
    /**
     * Split By Plane
     * only to be called for nodes with no children
     * @param plane
     * @param coplanarfrontnodes
     * @param coplanarbacknodes
     * @param frontnodes
     * @param backnodes
     * @private
     */
    _splitByPlane(plane: Plane, coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]): void;
    /**
     *  PRIVATE methods from here:
     * add child to a node
     * this should be called whenever the polygon is split
     * a child should be created for every fragment of the split polygon
     * returns the newly created child
     * @param polygon
     */
    addChild(polygon: Polygon3): PolygonTreeNode;
    /**
     * Invert Sub
     */
    invertSub(): void;
    /**
     * Recursively Invalidate Polygon
     */
    recursivelyInvalidatePolygon(): void;
}
//# sourceMappingURL=PolygonTreeNode.d.ts.map