import {_CSGDEBUG, EPS} from './constants';
import {Polygon3} from './math/Polygon3';
import {calcInterpolationFactor} from './math/calcInterpolationFactor';

// Returns object:
// .type:
//   0: coplanar-front
//   1: coplanar-back
//   2: front
//   3: back
//   4: spanning
// In case the polygon is spanning, returns:
// .front: a Polygon of the front part
// .back: a Polygon of the back part
function splitPolygonByPlane(plane, polygon) {
  const result = {
    type: null,
    front: null,
    back: null,
  };
  // cache in local lets (speedup):
  const planenormal = plane.normal;
  const vertices = polygon.vertices;
  const numvertices = vertices.length;
  if (polygon.plane.equals(plane)) {
    result.type = 0;
  } else {
    const thisw = plane.w;
    let hasfront = false;
    let hasback = false;
    const vertexIsBack = [];
    const MINEPS = -EPS;
    for (let i = 0; i < numvertices; i++) {
      const t = planenormal.dot(vertices[i].pos) - thisw;
      const isback = (t < 0);
      vertexIsBack.push(isback);
      if (t > EPS) hasfront = true;
      if (t < MINEPS) hasback = true;
    }
    if ((!hasfront) && (!hasback)) {
      // all points coplanar
      const t = planenormal.dot(polygon.plane.normal);
      result.type = (t >= 0) ? 0 : 1;
    } else if (!hasback) {
      result.type = 2;
    } else if (!hasfront) {
      result.type = 3;
    } else {
      // spanning
      result.type = 4;
      const frontvertices = [];
      const backvertices = [];
      let isback = vertexIsBack[0];
      for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
        const vertex = vertices[vertexindex];
        let nextvertexindex = vertexindex + 1;
        if (nextvertexindex >= numvertices) nextvertexindex = 0;
        const nextisback = vertexIsBack[nextvertexindex];
        if (isback === nextisback) {
          // line segment is on one side of the plane:
          if (isback) {
            backvertices.push(vertex);
          } else {
            frontvertices.push(vertex);
          }
        } else {
          // line segment intersects plane:
          const point = vertex.pos;
          const nextpoint = vertices[nextvertexindex].pos;
          const interpolationFactor =
            calcInterpolationFactor(point, nextpoint, plane.splitLineBetweenPoints(point, nextpoint));
          const intersectionvertex = vertex.interpolate(vertices[nextvertexindex], interpolationFactor);
          if (isback) {
            backvertices.push(vertex);
            backvertices.push(intersectionvertex);
            frontvertices.push(intersectionvertex);
          } else {
            frontvertices.push(vertex);
            frontvertices.push(intersectionvertex);
            backvertices.push(intersectionvertex);
          }
        }
        isback = nextisback;
      } // for vertexindex
      // remove duplicate vertices:
      const EPS_SQUARED = EPS * EPS;
      if (backvertices.length >= 3) {
        let prevvertex = backvertices[backvertices.length - 1];
        for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {
          const vertex = backvertices[vertexindex];
          if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
            backvertices.splice(vertexindex, 1);
            vertexindex--;
          }
          prevvertex = vertex;
        }
      }
      if (frontvertices.length >= 3) {
        let prevvertex = frontvertices[frontvertices.length - 1];
        for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {
          const vertex = frontvertices[vertexindex];
          if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
            frontvertices.splice(vertexindex, 1);
            vertexindex--;
          }
          prevvertex = vertex;
        }
      }
      if (frontvertices.length >= 3) {
        result.front = new Polygon3(frontvertices, polygon.shared, polygon.plane);
      }
      if (backvertices.length >= 3) {
        result.back = new Polygon3(backvertices, polygon.shared, polygon.plane);
      }
    }
  }
  return result;
}

// # class PolygonTreeNode
// This class manages hierarchical splits of polygons
// At the top is a root node which doesn hold a polygon, only child PolygonTreeNodes
// Below that are zero or more 'top' nodes; each holds a polygon. The polygons can be in different planes
// splitByPlane() splits a node by a plane. If the plane intersects the polygon, two new child nodes
// are created holding the splitted polygon.
// getPolygons() retrieves the polygon from the tree. If for PolygonTreeNode the polygon is split but
// the two split parts (child nodes) are still intact, then the unsplit polygon is returned.
// This ensures that we can safely split a polygon into many fragments. If the fragments are untouched,
//  getPolygons() will return the original unsplit polygon instead of the fragments.
// remove() removes a polygon from the tree. Once a polygon is removed, the parent polygons are invalidated
// since they are no longer intact.
// constructor creates the root node:
const PolygonTreeNode = function() {
  this.parent = null;
  this.children = [];
  this.polygon = null;
  this.removed = false;
};

PolygonTreeNode.prototype = {
  // fill the tree with polygons. Should be called on the root node only; child nodes must
  // always be a derivate (split) of the parent node.
  addPolygons(polygons) {
    // new polygons can only be added to root node; children can only be splitted polygons
    if (!this.isRootNode()) {
      throw new Error('Assertion failed');
    }
    const _this = this;
    polygons.map(function(polygon) {
      _this.addChild(polygon);
    });
  },

  // remove a node
  // - the siblings become toplevel nodes
  // - the parent is removed recursively
  remove() {
    if (!this.removed) {
      this.removed = true;

      if (_CSGDEBUG) {
        if (this.isRootNode()) throw new Error('Assertion failed'); // can't remove root node
        if (this.children.length) throw new Error('Assertion failed'); // we shouldn't remove nodes with children
      }

      // remove ourselves from the parent's children list:
      const parentschildren = this.parent.children;
      const i = parentschildren.indexOf(this);
      if (i < 0) throw new Error('Assertion failed');
      parentschildren.splice(i, 1);

      // invalidate the parent's polygon, and of all parents above it:
      this.parent.recursivelyInvalidatePolygon();
    }
  },

  isRemoved() {
    return this.removed;
  },

  isRootNode() {
    return !this.parent;
  },

  // invert all polygons in the tree. Call on the root node
  invert() {
    if (!this.isRootNode()) throw new Error('Assertion failed'); // can only call this on the root node
    this.invertSub();
  },

  getPolygon() {
    if (!this.polygon) throw new Error('Assertion failed'); // doesn't have a polygon, which means that it has been broken down
    return this.polygon;
  },

  getPolygons(result) {
    let children = [this];
    const queue = [children];
    let i, j, l, node;
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
  },

  // split the node by a plane; add the resulting nodes to the frontnodes and backnodes array
  // If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays
  // If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,
  //  and added to both arrays.
  splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
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
  },

  // only to be called for nodes with no children
  _splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
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
  },

  // PRIVATE methods from here:
  // add child to a node
  // this should be called whenever the polygon is split
  // a child should be created for every fragment of the split polygon
  // returns the newly created child
  addChild(polygon) {
    const newchild = new PolygonTreeNode();
    newchild.parent = this;
    newchild.polygon = polygon;
    this.children.push(newchild);
    return newchild;
  },

  invertSub() {
    let children = [this];
    const queue = [children];
    let i, j, l, node;
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
  },

  recursivelyInvalidatePolygon() {
    let node = this;
    while (node.polygon) {
      node.polygon = null;
      if (node.parent) {
        node = node.parent;
      }
    }
  },
};

// # class Tree
// This is the root of a BSP tree
// We are using this separate class for the root of the tree, to hold the PolygonTreeNode root
// The actual tree is kept in this.rootnode
export const Tree = function(polygons) {
  this.polygonTree = new PolygonTreeNode();
  this.rootnode = new Node(null);
  if (polygons) this.addPolygons(polygons);
};

Tree.prototype = {
  invert() {
    this.polygonTree.invert();
    this.rootnode.invert();
  },

  // Remove all polygons in this BSP tree that are inside the other BSP tree
  // `tree`.
  clipTo(tree, alsoRemovecoplanarFront) {
    alsoRemovecoplanarFront = !!alsoRemovecoplanarFront;
    this.rootnode.clipTo(tree, alsoRemovecoplanarFront);
  },

  allPolygons() {
    const result = [];
    this.polygonTree.getPolygons(result);
    return result;
  },

  addPolygons(polygons) {
    const _this = this;
    const polygontreenodes = polygons.map(function(p) {
      return _this.polygonTree.addChild(p);
    });
    this.rootnode.addPolygonTreeNodes(polygontreenodes);
  },
};

// # class Node
// Holds a node in a BSP tree. A BSP tree is built from a collection of polygons
// by picking a polygon to split along.
// Polygons are not stored directly in the tree, but in PolygonTreeNodes, stored in
// this.polygontreenodes. Those PolygonTreeNodes are children of the owning
// Tree.polygonTree
// This is not a leafy BSP tree since there is
// no distinction between internal and leaf nodes.
const Node = function(parent) {
  this.plane = null;
  this.front = null;
  this.back = null;
  this.polygontreenodes = [];
  this.parent = parent;
};

Node.prototype = {
  // Convert solid space to empty space and empty space to solid space.
  invert() {
    const queue = [this];
    let node;
    for (let i = 0; i < queue.length; i++) {
      node = queue[i];
      if (node.plane) node.plane = node.plane.flipped();
      if (node.front) queue.push(node.front);
      if (node.back) queue.push(node.back);
      const temp = node.front;
      node.front = node.back;
      node.back = temp;
    }
  },

  // clip polygontreenodes to our plane
  // calls remove() for all clipped PolygonTreeNodes
  clipPolygons(polygontreenodes, alsoRemovecoplanarFront) {
    let args = {'node': this, 'polygontreenodes': polygontreenodes};
    let node;
    const stack = [];

    do {
      node = args.node;
      polygontreenodes = args.polygontreenodes;

      // begin "function"
      if (node.plane) {
        const backnodes = [];
        const frontnodes = [];
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
      args = stack.pop();
    } while (typeof (args) !== 'undefined');
  },

  // Remove all polygons in this BSP tree that are inside the other BSP tree
  // `tree`.
  clipTo(tree, alsoRemovecoplanarFront) {
    let node = this;
    const stack = [];
    do {
      if (node.polygontreenodes.length > 0) {
        tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront);
      }
      if (node.front) stack.push(node.front);
      if (node.back) stack.push(node.back);
      node = stack.pop();
    } while (typeof (node) !== 'undefined');
  },

  addPolygonTreeNodes(polygontreenodes) {
    let args = {'node': this, 'polygontreenodes': polygontreenodes};
    let node;
    const stack = [];
    do {
      node = args.node;
      polygontreenodes = args.polygontreenodes;

      if (polygontreenodes.length === 0) {
        args = stack.pop();
        continue;
      }
      const _this = node;
      if (!node.plane) {
        const bestplane = polygontreenodes[0].getPolygon().plane;
        node.plane = bestplane;
      }
      const frontnodes = [];
      const backnodes = [];

      for (let i = 0, n = polygontreenodes.length; i < n; ++i) {
        polygontreenodes[i].splitByPlane(_this.plane, _this.polygontreenodes, backnodes, frontnodes, backnodes);
      }

      if (frontnodes.length > 0) {
        if (!node.front) node.front = new Node(node);
        stack.push({'node': node.front, 'polygontreenodes': frontnodes});
      }
      if (backnodes.length > 0) {
        if (!node.back) node.back = new Node(node);
        stack.push({'node': node.back, 'polygontreenodes': backnodes});
      }

      args = stack.pop();
    } while (typeof (args) !== 'undefined');
  },

  getParentPlaneNormals(normals, maxdepth) {
    if (maxdepth > 0) {
      if (this.parent) {
        normals.push(this.parent.plane.normal);
        this.parent.getParentPlaneNormals(normals, maxdepth - 1);
      }
    }
  },
};
