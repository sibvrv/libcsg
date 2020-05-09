import {Polygon3} from '@core/math';
import {PolygonTreeNode} from '@core/PolygonTreeNode';
import {Node} from '@core/Node';

// # class Tree
// This is the root of a BSP tree
// We are using this separate class for the root of the tree, to hold the PolygonTreeNode root
// The actual tree is kept in this.rootnode
export class Tree {
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

  invert() {
    this.polygonTree.invert();
    this.rootnode.invert();
  }

  // Remove all polygons in this BSP tree that are inside the other BSP tree
  // `tree`.
  clipTo(tree: Tree, alsoRemovecoplanarFront?: boolean) {
    alsoRemovecoplanarFront = !!alsoRemovecoplanarFront;
    this.rootnode.clipTo(tree, alsoRemovecoplanarFront);
  }

  allPolygons() {
    const result: Polygon3[] = [];
    this.polygonTree.getPolygons(result);
    return result;
  }

  addPolygons(polygons: Polygon3[]) {
    const _this = this;
    const polygontreenodes = polygons.map((p) => {
      return _this.polygonTree.addChild(p);
    });
    this.rootnode.addPolygonTreeNodes(polygontreenodes);
  }
}
