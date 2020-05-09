import {Plane, Vector3} from '@core/math';
import {Tree} from '@core/Tree';
import {PolygonTreeNode} from '@core/PolygonTreeNode';

// # class Node
// Holds a node in a BSP tree. A BSP tree is built from a collection of polygons
// by picking a polygon to split along.
// Polygons are not stored directly in the tree, but in PolygonTreeNodes, stored in
// this.polygontreenodes. Those PolygonTreeNodes are children of the owning
// Tree.polygonTree
// This is not a leafy BSP tree since there is
// no distinction between internal and leaf nodes.
export class Node {
  plane: Plane | null = null;
  front: Node | null = null;
  back: Node | null = null;
  polygontreenodes = [];

  /**
   * Node Constructor
   */
  constructor(public parent: Node | null) {

  }

  // Convert solid space to empty space and empty space to solid space.
  invert() {
    const queue: Node[] = [this];

    let node: Node;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < queue.length; i++) {
      node = queue[i];
      if (node.plane) {
        node.plane = node.plane.flipped();
      }
      if (node.front) {
        queue.push(node.front);
      }
      if (node.back) {
        queue.push(node.back);
      }
      const temp = node.front;
      node.front = node.back;
      node.back = temp;
    }
  }

  // clip polygontreenodes to our plane
  // calls remove() for all clipped PolygonTreeNodes
  clipPolygons(polygontreenodes: PolygonTreeNode[], alsoRemovecoplanarFront?: boolean) {
    let args = {
      'node': this as Node,
      'polygontreenodes': polygontreenodes,
    };
    let node;
    const stack = [];

    do {
      node = args.node;
      polygontreenodes = args.polygontreenodes;

      // begin "function"
      if (node.plane) {
        const backnodes: PolygonTreeNode[] = [];
        const frontnodes: PolygonTreeNode[] = [];
        const coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes;
        const plane = node.plane;
        const numpolygontreenodes = polygontreenodes.length;
        for (let i = 0; i < numpolygontreenodes; i++) {
          const node1 = polygontreenodes[i];
          if (!node1.isRemoved()) {
            node1.splitByPlane(plane, coplanarfrontnodes, backnodes, frontnodes, backnodes);
          }
        }

        if (node.front && (frontnodes.length > 0)) {
          stack.push({'node': node.front, 'polygontreenodes': frontnodes});
        }
        const numbacknodes = backnodes.length;
        if (node.back && (numbacknodes > 0)) {
          stack.push({'node': node.back, 'polygontreenodes': backnodes});
        } else {
          // there's nothing behind this plane. Delete the nodes behind this plane:
          for (let i = 0; i < numbacknodes; i++) {
            backnodes[i].remove();
          }
        }
      }
      args = stack.pop()!;
    } while (typeof (args) !== 'undefined');
  }

  // Remove all polygons in this BSP tree that are inside the other BSP tree
  // `tree`.
  clipTo(tree: Tree, alsoRemovecoplanarFront?: boolean) {
    let node: Node = this;
    const stack = [];

    do {
      if (node.polygontreenodes.length > 0) {
        tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront);
      }
      if (node.front) stack.push(node.front);
      if (node.back) stack.push(node.back);
      node = stack.pop()!;
    } while (typeof (node) !== 'undefined');
  }

  addPolygonTreeNodes(polygontreenodes: PolygonTreeNode[]) {
    let args = {
      'node': this as Node,
      'polygontreenodes': polygontreenodes,
    };

    let node;
    const stack = [];
    do {
      node = args.node;
      polygontreenodes = args.polygontreenodes;

      if (polygontreenodes.length === 0) {
        args = stack.pop()!;
        continue;
      }
      const _this = node;
      if (!node.plane) {
        const bestplane = polygontreenodes[0].getPolygon().plane;
        node.plane = bestplane;
      }
      const frontnodes: PolygonTreeNode[] = [];
      const backnodes: PolygonTreeNode[] = [];

      for (let i = 0, n = polygontreenodes.length; i < n; ++i) {
        polygontreenodes[i].splitByPlane(_this.plane!, _this.polygontreenodes, backnodes, frontnodes, backnodes);
      }

      if (frontnodes.length > 0) {
        if (!node.front) {
          node.front = new Node(node);
        }

        stack.push({
          'node': node.front,
          'polygontreenodes': frontnodes,
        });
      }
      if (backnodes.length > 0) {
        if (!node.back) {
          node.back = new Node(node);
        }

        stack.push({
          'node': node.back,
          'polygontreenodes': backnodes,
        });
      }

      args = stack.pop()!;
    } while (typeof (args) !== 'undefined');
  }

  getParentPlaneNormals(normals: Vector3[], maxdepth: number) {
    if (maxdepth > 0) {
      if (this.parent && this.parent.plane) {
        normals.push(this.parent.plane.normal);
        this.parent.getParentPlaneNormals(normals, maxdepth - 1);
      }
    }
  }
}
