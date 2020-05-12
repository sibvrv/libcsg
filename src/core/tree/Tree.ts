import {Polygon3} from '@core/math';
import {PolygonTreeNode} from '@core/tree/PolygonTreeNode';
import {Node} from '@core/tree/Node';
import {ITree} from '@core/tree/treeTypes';

/**
 * @class Tree
 * This is the root of a BSP tree
 * We are using this separate class for the root of the tree, to hold the PolygonTreeNode root
 * The actual tree is kept in this.rootnode
 */
export class Tree implements ITree {
  polygonTree = new PolygonTreeNode();
  rootnode = new Node(null);

  /**
   * Tree Constructor
   */
  constructor(polygons?: Polygon3[]) {
    if (polygons) {
      this.addPolygons(polygons);
    }
  }

  /**
   * Invert
   */
  invert() {
    this.polygonTree.invert();
    this.rootnode.invert();
  }

  /**
   * Remove all polygons in this BSP tree that are inside the other BSP tree
   * `tree`.
   * @param tree
   * @param alsoRemoveCoplanarFront
   */
  clipTo(tree: Tree, alsoRemoveCoplanarFront?: boolean) {
    alsoRemoveCoplanarFront = !!alsoRemoveCoplanarFront;
    this.rootnode.clipTo(tree, alsoRemoveCoplanarFront);
  }

  /**
   * All Polygons
   */
  allPolygons() {
    const result: Polygon3[] = [];
    this.polygonTree.getPolygons(result);
    return result;
  }

  /**
   * Add Polygons
   * @param polygons
   */
  addPolygons(polygons: Polygon3[]) {
    const _this = this;
    const polygontreenodes = polygons.map((p) => {
      return _this.polygonTree.addChild(p);
    });
    this.rootnode.addPolygonTreeNodes(polygontreenodes);
  }
}
