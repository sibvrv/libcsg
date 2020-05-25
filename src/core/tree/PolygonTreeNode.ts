import {_CSGDEBUG, EPS} from '@core/constants';
import {splitPolygonByPlane} from '@core/splitPolygonByPlane';
import {Plane, Polygon3} from '@core/math';
import {IPolygonTreeNode} from '@core/tree/treeTypes';

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
export class PolygonTreeNode implements IPolygonTreeNode {
  parent: PolygonTreeNode | null = null;
  children: PolygonTreeNode[] = [];
  polygon: Polygon3 | null = null;
  removed = false;

  /**
   * fill the tree with polygons. Should be called on the root node only; child nodes must
   * always be a derivate (split) of the parent node.
   * @param polygons
   */
  addPolygons(polygons: Polygon3[]) {
    // new polygons can only be added to root node; children can only be splitted polygons
    if (!this.isRootNode()) {
      throw new Error('Assertion failed');
    }
    const _this = this;
    polygons.map((polygon) => {
      _this.addChild(polygon);
    });
  }

  /**
   * remove a node
   * - the siblings become toplevel nodes
   * - the parent is removed recursively
   */
  remove() {
    if (!this.removed) {
      this.removed = true;

      if (_CSGDEBUG) {
        if (this.isRootNode()) throw new Error('Assertion failed'); // can't remove root node
        if (this.children.length) throw new Error('Assertion failed'); // we shouldn't remove nodes with children
      }

      if (this.parent) {
        // remove ourselves from the parent's children list:
        const parentschildren = this.parent.children;
        const i = parentschildren.indexOf(this);
        if (i < 0) throw new Error('Assertion failed');
        parentschildren.splice(i, 1);

        // invalidate the parent's polygon, and of all parents above it:
        this.parent.recursivelyInvalidatePolygon();
      }
    }
  }

  /**
   * isRemoved
   */
  isRemoved() {
    return this.removed;
  }

  /**
   * isRootNode
   */
  isRootNode() {
    return !this.parent;
  }

  /**
   * Invert
   * invert all polygons in the tree. Call on the root node
   */
  invert() {
    if (!this.isRootNode()) throw new Error('Assertion failed'); // can only call this on the root node
    this.invertSub();
  }

  /**
   * Get Polygon
   */
  getPolygon() {
    if (!this.polygon) throw new Error('Assertion failed'); // doesn't have a polygon, which means that it has been broken down
    return this.polygon;
  }

  /**
   * Get Polygons
   * @param result
   */
  getPolygons(result: Polygon3[]) {
    let children: PolygonTreeNode[] = [this];
    const queue = [children];
    let i;
    let j;
    let l;
    let node;
    for (i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length
      children = queue[i];
      for (j = 0, l = children.length; j < l; j++) { // ok to cache length
        node = children[j];
        if (node.polygon) {
          // the polygon hasn't been broken yet. We can ignore the children and return our polygon:
          result.push(node.polygon);
        } else {
          // our polygon has been split up and broken, so gather all subpolygons from the children
          queue.push(node.children);
        }
      }
    }
  }

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
  splitByPlane(plane: Plane, coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]) {
    if (this.children.length) {
      const queue = [this.children];
      let i;
      let j;
      let l;
      let node;
      let nodes;
      for (i = 0; i < queue.length; i++) { // queue.length can increase, do not cache
        nodes = queue[i];
        for (j = 0, l = nodes.length; j < l; j++) { // ok to cache length
          node = nodes[j];
          if (node.children.length) {
            queue.push(node.children);
          } else {
            // no children. Split the polygon:
            node._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
          }
        }
      }
    } else {
      this._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
    }
  }

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
  _splitByPlane(plane: Plane, coplanarfrontnodes: PolygonTreeNode[], coplanarbacknodes: PolygonTreeNode[], frontnodes: PolygonTreeNode[], backnodes: PolygonTreeNode[]) {
    const polygon = this.polygon;
    if (polygon) {
      const bound = polygon.boundingSphere();
      const sphereradius = bound[1] + EPS; // FIXME Why add imprecision?
      const planenormal = plane.normal;
      const spherecenter = bound[0];
      const d = planenormal.dot(spherecenter) - plane.w;
      if (d > sphereradius) {
        frontnodes.push(this);
      } else if (d < -sphereradius) {
        backnodes.push(this);
      } else {
        const splitresult = splitPolygonByPlane(plane, polygon);
        switch (splitresult.type) {
          case 0:
            // coplanar front:
            coplanarfrontnodes.push(this);
            break;

          case 1:
            // coplanar back:
            coplanarbacknodes.push(this);
            break;

          case 2:
            // front:
            frontnodes.push(this);
            break;

          case 3:
            // back:
            backnodes.push(this);
            break;

          case 4:
            // spanning:
            if (splitresult.front) {
              const frontnode = this.addChild(splitresult.front);
              frontnodes.push(frontnode);
            }
            if (splitresult.back) {
              const backnode = this.addChild(splitresult.back);
              backnodes.push(backnode);
            }
            break;
        }
      }
    }
  }

  /**
   *  PRIVATE methods from here:
   * add child to a node
   * this should be called whenever the polygon is split
   * a child should be created for every fragment of the split polygon
   * returns the newly created child
   * @param polygon
   */
  addChild(polygon: Polygon3) {
    const newchild = new PolygonTreeNode();
    newchild.parent = this;
    newchild.polygon = polygon;
    this.children.push(newchild);
    return newchild;
  }

  /**
   * Invert Sub
   */
  invertSub() {
    let children: PolygonTreeNode[] = [this];
    const queue = [children];
    let i;
    let j;
    let l;
    let node;
    for (i = 0; i < queue.length; i++) {
      children = queue[i];
      for (j = 0, l = children.length; j < l; j++) {
        node = children[j];
        if (node.polygon) {
          node.polygon = node.polygon.flipped();
        }
        queue.push(node.children);
      }
    }
  }

  /**
   * Recursively Invalidate Polygon
   */
  recursivelyInvalidatePolygon() {
    let node: PolygonTreeNode = this;
    while (node.polygon) {
      node.polygon = null;
      if (node.parent) {
        node = node.parent;
      }
    }
  }
}