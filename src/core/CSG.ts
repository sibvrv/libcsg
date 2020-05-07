import {Tree} from './trees';
import {Polygon} from './math/Polygon3';
import {Plane} from './math/Plane';
import {OrthoNormalBasis} from './math/OrthoNormalBasis';

import {Properties} from './Properties';
import {fixTJunctions} from './utils/fixTJunctions';
import {canonicalize} from './utils/canonicalize';
import {reTesselate} from './utils/retesellate';
import {bounds} from './utils/csgMeasurements';
import {projectToOrthoNormalBasis} from './utils/csgProjections';

import {getTransformationAndInverseTransformationToFlatLying, getTransformationToFlatLying, lieFlat} from '../api/ops-cnc';
import {cutByPlane, sectionCut} from '../api/ops-cuts';
import {center} from '../api/center';
import {contract, expand, expandedShellOfCCSG} from '../modifiers/expansions';

import {_CSGDEBUG, all, angleEPS, areaEPS, back, bottom, defaultResolution2D, defaultResolution3D, EPS, front, getTag, left, right, staticTag, top} from './constants';
import {sphere, cube, roundedCube, cylinder, roundedCylinder, cylinderElliptic, polyhedron} from '../primitives/csg/primitives3d';
import {fromPolygons, fromCompactBinary, fromObject, fromSlices} from './CSGFactories';
import {addTransformationMethodsToPrototype} from './mutators';
import * as optionsParsers from '../api/optionParsers';


import {Vector2 as _Vector2D} from './math/Vector2';
import {Vector3 as _Vector3D} from './math/Vector3';
import {Vertex3 as _Vertex} from './math/Vertex3';
import * as _Plane from './math/Plane';
import * as _Polygon from './math/Polygon3';
import * as _Polygon2D from './math/Polygon2';
import {Line2D} from './math/Line2';
import * as _Line3D from './math/Line3';
import * as _Path2D from './math/Path2';
import * as _OrthoNormalBasis from './math/OrthoNormalBasis';
import {Matrix4x4 as _Matrix4x4} from './math/Matrix4';
import {Connector} from './Connector';
import {ConnectorList} from './ConnectorList';
import * as _Properties from './Properties';
import {TransformationMethods} from './TransformationMethods';


/** Class CSG
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 * @constructor
 */
export class CSG extends TransformationMethods {
  polygons = [];
  properties = new Properties();
  isCanonicalized = true;
  isRetesselated = true;

  /**
   * Return a new CSG solid representing the space in either this solid or
   * in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.union(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |       +----+
   * +----+--+    |       +----+       |
   *      |   B   |            |       |
   *      |       |            |       |
   *      +-------+            +-------+
   */
  union(csg) {
    let csgs;
    if (csg instanceof Array) {
      csgs = csg.slice(0);
      csgs.push(this);
    } else {
      csgs = [this, csg];
    }

    let i;
    // combine csg pairs in a way that forms a balanced binary tree pattern
    for (i = 1; i < csgs.length; i += 2) {
      csgs.push(csgs[i - 1].unionSub(csgs[i]));
    }
    return csgs[i - 1].reTesselated().canonicalized();
  }

  unionSub(csg, retesselate, canonicalize) {
    if (!this.mayOverlap(csg)) {
      return this.unionForNonIntersecting(csg);
    } else {
      const a = new Tree(this.polygons);
      const b = new Tree(csg.polygons);
      a.clipTo(b, false);

      // b.clipTo(a, true); // ERROR: this doesn't work
      b.clipTo(a);
      b.invert();
      b.clipTo(a);
      b.invert();

      const newpolygons = a.allPolygons().concat(b.allPolygons());
      let result = fromPolygons(newpolygons);
      result.properties = this.properties._merge(csg.properties);
      if (retesselate) result = result.reTesselated();
      if (canonicalize) result = result.canonicalized();
      return result;
    }
  }

  // Like union, but when we know that the two solids are not intersecting
  // Do not use if you are not completely sure that the solids do not intersect!
  unionForNonIntersecting(csg) {
    const newpolygons = this.polygons.concat(csg.polygons);
    const result = fromPolygons(newpolygons);
    result.properties = this.properties._merge(csg.properties);
    result.isCanonicalized = this.isCanonicalized && csg.isCanonicalized;
    result.isRetesselated = this.isRetesselated && csg.isRetesselated;
    return result;
  }

  /**
   * Return a new CSG solid representing space in this solid but
   * not in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.subtract(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |    +--+
   * +----+--+    |       +----+
   *      |   B   |
   *      |       |
   *      +-------+
   */
  subtract(csg) {
    let csgs;
    if (csg instanceof Array) {
      csgs = csg;
    } else {
      csgs = [csg];
    }
    let result = this;
    for (let i = 0; i < csgs.length; i++) {
      const islast = (i === (csgs.length - 1));
      result = result.subtractSub(csgs[i], islast, islast);
    }
    return result;
  }

  subtractSub(csg, retesselate, canonicalize) {
    const a = new Tree(this.polygons);
    const b = new Tree(csg.polygons);
    a.invert();
    a.clipTo(b);
    b.clipTo(a, true);
    a.addPolygons(b.allPolygons());
    a.invert();
    let result = fromPolygons(a.allPolygons());
    result.properties = this.properties._merge(csg.properties);
    if (retesselate) result = result.reTesselated();
    if (canonicalize) result = result.canonicalized();
    return result;
  }

  /**
   * Return a new CSG solid representing space in both this solid and
   * in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.intersect(B)
   * @example
   * +-------+
   * |       |
   * |   A   |
   * |    +--+----+   =   +--+
   * +----+--+    |       +--+
   *      |   B   |
   *      |       |
   *      +-------+
   */
  intersect(csg) {
    let csgs;
    if (csg instanceof Array) {
      csgs = csg;
    } else {
      csgs = [csg];
    }
    let result = this;
    for (let i = 0; i < csgs.length; i++) {
      const islast = (i === (csgs.length - 1));
      result = result.intersectSub(csgs[i], islast, islast);
    }
    return result;
  }

  intersectSub(csg, retesselate, canonicalize) {
    const a = new Tree(this.polygons);
    const b = new Tree(csg.polygons);
    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    b.clipTo(a);
    a.addPolygons(b.allPolygons());
    a.invert();
    let result = fromPolygons(a.allPolygons());
    result.properties = this.properties._merge(csg.properties);
    if (retesselate) result = result.reTesselated();
    if (canonicalize) result = result.canonicalized();
    return result;
  }

  /**
   * Return a new CSG solid with solid and empty space switched.
   * This solid is not modified.
   * @returns {CSG} new CSG object
   * @example
   * let B = A.invert()
   */
  invert() {
    const flippedpolygons = this.polygons.map((p) => {
      return p.flipped();
    });
    return fromPolygons(flippedpolygons);
    // TODO: flip properties?
  }

  // Affine transformation of CSG object. Returns a new CSG object
  transform1(matrix4x4) {
    const newpolygons = this.polygons.map((p) => {
      return p.transform(matrix4x4);
    });
    const result = fromPolygons(newpolygons);
    result.properties = this.properties._transform(matrix4x4);
    result.isRetesselated = this.isRetesselated;
    return result;
  }

  /**
   * Return a new CSG solid that is transformed using the given Matrix.
   * Several matrix transformations can be combined before transforming this solid.
   * @param {CSG.Matrix4x4} matrix4x4 - matrix to be applied
   * @returns {CSG} new CSG object
   * @example
   * var m = new CSG.Matrix4x4()
   * m = m.multiply(CSG.Matrix4x4.rotationX(40))
   * m = m.multiply(CSG.Matrix4x4.translation([-.5, 0, 0]))
   * let B = A.transform(m)
   */
  transform(matrix4x4) {
    const ismirror = matrix4x4.isMirroring();
    const transformedvertices = {};
    const transformedplanes = {};
    const newpolygons = this.polygons.map((p) => {
      let newplane;
      const plane = p.plane;
      const planetag = plane.getTag();
      if (planetag in transformedplanes) {
        newplane = transformedplanes[planetag];
      } else {
        newplane = plane.transform(matrix4x4);
        transformedplanes[planetag] = newplane;
      }
      const newvertices = p.vertices.map((v) => {
        let newvertex;
        const vertextag = v.getTag();
        if (vertextag in transformedvertices) {
          newvertex = transformedvertices[vertextag];
        } else {
          newvertex = v.transform(matrix4x4);
          transformedvertices[vertextag] = newvertex;
        }
        return newvertex;
      });
      if (ismirror) newvertices.reverse();
      return new Polygon(newvertices, p.shared, newplane);
    });
    const result = fromPolygons(newpolygons);
    result.properties = this.properties._transform(matrix4x4);
    result.isRetesselated = this.isRetesselated;
    result.isCanonicalized = this.isCanonicalized;
    return result;
  }

  // ALIAS !
  center(axes) {
    return center({axes}, [this]);
  }

  // ALIAS !
  expand(radius, resolution) {
    return expand(this, radius, resolution);
  }

  // ALIAS !
  contract(radius, resolution) {
    return contract(this, radius, resolution);
  }

  // ALIAS !
  expandedShell(radius, resolution, unionWithThis) {
    return expandedShellOfCCSG(this, radius, resolution, unionWithThis);
  }

  // cut the solid at a plane, and stretch the cross-section found along plane normal
  // note: only used in roundedCube() internally
  stretchAtPlane(normal, point, length) {
    const plane = Plane.fromNormalAndPoint(normal, point);
    const onb = new OrthoNormalBasis(plane);
    const crosssect = this.sectionCut(onb);
    const midpiece = crosssect.extrudeInOrthonormalBasis(onb, length);
    const piece1 = this.cutByPlane(plane);
    const piece2 = this.cutByPlane(plane.flipped());
    const result = piece1.union([midpiece, piece2.translate(plane.normal.times(length))]);
    return result;
  }

  // ALIAS !
  canonicalized() {
    return canonicalize(this);
  }

  // ALIAS !
  reTesselated() {
    return reTesselate(this);
  }

  // ALIAS !
  fixTJunctions() {
    return fixTJunctions(fromPolygons, this);
  }

  // ALIAS !
  getBounds() {
    return bounds(this);
  }

  /** returns true if there is a possibility that the two solids overlap
   * returns false if we can be sure that they do not overlap
   * NOTE: this is critical as it is used in UNIONs
   * @param  {CSG} csg
   */
  mayOverlap(csg) {
    if ((this.polygons.length === 0) || (csg.polygons.length === 0)) {
      return false;
    } else {
      const mybounds = bounds(this);
      const otherbounds = bounds(csg);
      if (mybounds[1].x < otherbounds[0].x) return false;
      if (mybounds[0].x > otherbounds[1].x) return false;
      if (mybounds[1].y < otherbounds[0].y) return false;
      if (mybounds[0].y > otherbounds[1].y) return false;
      if (mybounds[1].z < otherbounds[0].z) return false;
      if (mybounds[0].z > otherbounds[1].z) return false;
      return true;
    }
  }

  // ALIAS !
  cutByPlane(plane) {
    return cutByPlane(this, plane);
  }

  /**
   * Connect a solid to another solid, such that two Connectors become connected
   * @param  {Connector} myConnector a Connector of this solid
   * @param  {Connector} otherConnector a Connector to which myConnector should be connected
   * @param  {Boolean} mirror false: the 'axis' vectors of the connectors should point in the same direction
   * true: the 'axis' vectors of the connectors should point in opposite direction
   * @param  {Float} normalrotation degrees of rotation between the 'normal' vectors of the two
   * connectors
   * @returns {CSG} this csg, tranformed accordingly
   */
  connectTo(myConnector, otherConnector, mirror, normalrotation) {
    const matrix = myConnector.getTransformationTo(otherConnector, mirror, normalrotation);
    return this.transform(matrix);
  }

  /**
   * set the .shared property of all polygons
   * @param  {Object} shared
   * @returns {CSG} Returns a new CSG solid, the original is unmodified!
   */
  setShared(shared) {
    const polygons = this.polygons.map((p) => {
      return new Polygon(p.vertices, shared, p.plane);
    });
    const result = fromPolygons(polygons);
    result.properties = this.properties; // keep original properties
    result.isRetesselated = this.isRetesselated;
    result.isCanonicalized = this.isCanonicalized;
    return result;
  }

  /** sets the color of this csg: non mutating, returns a new CSG
   * @param  {Object} args
   * @returns {CSG} a copy of this CSG, with the given color
   */
  setColor(args) {
    const newshared = Polygon.Shared.fromColor.apply(this, arguments);
    return this.setShared(newshared);
  }

  // ALIAS !
  getTransformationAndInverseTransformationToFlatLying() {
    return getTransformationAndInverseTransformationToFlatLying(this);
  }

  // ALIAS !
  getTransformationToFlatLying() {
    return getTransformationToFlatLying(this);
  }

  // ALIAS !
  lieFlat() {
    return lieFlat(this);
  }

  // project the 3D CSG onto a plane
  // This returns a 2D CAG with the 'shadow' shape of the 3D solid when projected onto the
  // plane represented by the orthonormal basis
  projectToOrthoNormalBasis(orthobasis) {
    // FIXME:  DEPENDS ON CAG !!
    return projectToOrthoNormalBasis(this, orthobasis);
  }

  // FIXME: not finding any uses within our code ?
  sectionCut(orthobasis) {
    return sectionCut(this, orthobasis);
  }

  /**
   * Returns an array of values for the requested features of this solid.
   * Supported Features: 'volume', 'area'
   * @param {String[]} features - list of features to calculate
   * @returns {Float[]} values
   * @example
   * let volume = A.getFeatures('volume')
   * let values = A.getFeatures('area','volume')
   */
  getFeatures(features) {
    if (!(features instanceof Array)) {
      features = [features];
    }
    const result = this.toTriangles().map((triPoly) => {
      return triPoly.getTetraFeatures(features);
    })
      .reduce((pv, v) => {
        return v.map((feat, i) => {
          return feat + (pv === 0 ? 0 : pv[i]);
        });
      }, 0);
    return (result.length === 1) ? result[0] : result;
  }

  /** @return {Polygon[]} The list of polygons. */
  toPolygons() {
    return this.polygons;
  }

  toString() {
    let result = 'CSG solid:\n';
    this.polygons.map((p) => {
      result += p.toString();
    });
    return result;
  }

  /** returns a compact binary representation of this csg
   * usually used to transfer CSG objects to/from webworkes
   * NOTE: very interesting compact format, with a lot of reusable ideas
   * @returns {Object} compact binary representation of a CSG
   */
  toCompactBinary() {
    const csg = this.canonicalized();
    const numpolygons = csg.polygons.length;
    let numpolygonvertices = 0;

    let numvertices = 0;
    const vertexmap = {};
    const vertices = [];

    let numplanes = 0;
    const planemap = {};
    const planes = [];

    const shareds = [];
    const sharedmap = {};
    let numshared = 0;
    // for (let i = 0, iMax = csg.polygons.length; i < iMax; i++) {
    //  let p = csg.polygons[i];
    //  for (let j = 0, jMax = p.length; j < jMax; j++) {
    //      ++numpolygonvertices;
    //      let vertextag = p[j].getTag();
    //      if(!(vertextag in vertexmap)) {
    //          vertexmap[vertextag] = numvertices++;
    //          vertices.push(p[j]);
    //      }
    //  }
    csg.polygons.map((polygon) => {
      // FIXME: why use map if we do not return anything ?
      // either for... or forEach
      polygon.vertices.map((vertex) => {
        ++numpolygonvertices;
        const vertextag = vertex.getTag();
        if (!(vertextag in vertexmap)) {
          vertexmap[vertextag] = numvertices++;
          vertices.push(vertex);
        }
      });

      const planetag = polygon.plane.getTag();
      if (!(planetag in planemap)) {
        planemap[planetag] = numplanes++;
        planes.push(polygon.plane);
      }
      const sharedtag = polygon.shared.getTag();
      if (!(sharedtag in sharedmap)) {
        sharedmap[sharedtag] = numshared++;
        shareds.push(polygon.shared);
      }
    });

    const numVerticesPerPolygon = new Uint32Array(numpolygons);
    const polygonSharedIndexes = new Uint32Array(numpolygons);
    const polygonVertices = new Uint32Array(numpolygonvertices);
    const polygonPlaneIndexes = new Uint32Array(numpolygons);
    const vertexData = new Float64Array(numvertices * 3);
    const planeData = new Float64Array(numplanes * 4);
    let polygonVerticesIndex = 0;

    // FIXME: doublecheck : why does it go through the whole polygons again?
    // can we optimise that ? (perhap due to needing size to init buffers above)
    for (let polygonindex = 0; polygonindex < numpolygons; ++polygonindex) {
      const polygon = csg.polygons[polygonindex];
      numVerticesPerPolygon[polygonindex] = polygon.vertices.length;
      polygon.vertices.map((vertex) => {
        const vertextag = vertex.getTag();
        const vertexindex = vertexmap[vertextag];
        polygonVertices[polygonVerticesIndex++] = vertexindex;
      });
      const planetag = polygon.plane.getTag();
      const planeindex = planemap[planetag];
      polygonPlaneIndexes[polygonindex] = planeindex;
      const sharedtag = polygon.shared.getTag();
      const sharedindex = sharedmap[sharedtag];
      polygonSharedIndexes[polygonindex] = sharedindex;
    }
    let verticesArrayIndex = 0;
    vertices.map((vertex) => {
      const pos = vertex.pos;
      vertexData[verticesArrayIndex++] = pos._x;
      vertexData[verticesArrayIndex++] = pos._y;
      vertexData[verticesArrayIndex++] = pos._z;
    });
    let planesArrayIndex = 0;
    planes.map((plane) => {
      const normal = plane.normal;
      planeData[planesArrayIndex++] = normal._x;
      planeData[planesArrayIndex++] = normal._y;
      planeData[planesArrayIndex++] = normal._z;
      planeData[planesArrayIndex++] = plane.w;
    });

    const result = {
      'class': 'CSG',
      numPolygons: numpolygons,
      numVerticesPerPolygon,
      polygonPlaneIndexes,
      polygonSharedIndexes,
      polygonVertices,
      vertexData,
      planeData,
      shared: shareds,
    };
    return result;
  }

  /** returns the triangles of this csg
   * @returns {Polygons} triangulated polygons
   */
  toTriangles() {
    const polygons = [];
    this.polygons.forEach((poly) => {
      const firstVertex = poly.vertices[0];
      for (let i = poly.vertices.length - 3; i >= 0; i--) {
        polygons.push(new Polygon(
          [
            firstVertex,
            poly.vertices[i + 1],
            poly.vertices[i + 2],
          ],
          poly.shared,
          poly.plane));
      }
    });
    return polygons;
  }

// eek ! all this is kept for backwards compatibility...for now

// FIXME: how many are actual useful to be exposed as API ?? looks like a code smell
  static Vector2D = _Vector2D;
  static Vector3D = _Vector3D;
  static Vertex = _Vertex;
  static Plane = _Plane;
  static Polygon = _Polygon;
  static Polygon2D = _Polygon2D;
  static Line2D = Line2D;
  static Line3D = _Line3D;
  static Path2D = _Path2D;
  static OrthoNormalBasis = _OrthoNormalBasis;
  static Matrix4x4 = _Matrix4x4;
  static Connector = Connector;
  static ConnectorList = ConnectorList;
  static Properties = _Properties;

  static _CSGDEBUG = _CSGDEBUG;
  static defaultResolution2D = defaultResolution2D;
  static defaultResolution3D = defaultResolution3D;
  static EPS = EPS;
  static angleEPS = angleEPS;
  static areaEPS = areaEPS;
  static all = all;
  static top = top;
  static bottom = bottom;
  static left = left;
  static right = right;
  static front = front;
  static back = back;
  static staticTag = staticTag;
  static getTag = getTag;

  static sphere = sphere;
  static cube = cube;
  static roundedCube = roundedCube;
  static cylinder = cylinder;
  static roundedCylinder = roundedCylinder;
  static cylinderElliptic = cylinderElliptic;
  static polyhedron = polyhedron;

// injecting factories
  static fromCompactBinary = fromCompactBinary;
  static fromObject = fromObject;
  static fromSlices = fromSlices;
  static fromPolygons = fromPolygons;

  static parseOptionAs2DVector = optionsParsers.parseOptionAs3DVector;
  static parseOptionAs3DVector = optionsParsers.parseOptionAs3DVector;
  static parseOptionAs3DVectorList = optionsParsers.parseOptionAs3DVectorList;
  static parseOptionAsBool = optionsParsers.parseOptionAsBool;
  static parseOptionAsFloat = optionsParsers.parseOptionAsFloat;
  static parseOptionAsInt = optionsParsers.parseOptionAsInt;
}

addTransformationMethodsToPrototype(CSG.Vector3D.prototype);
addTransformationMethodsToPrototype(CSG.Vertex.prototype);
addTransformationMethodsToPrototype(CSG.Polygon.prototype);
addTransformationMethodsToPrototype(CSG.Path2D.prototype);
addTransformationMethodsToPrototype(CSG.OrthoNormalBasis.prototype);
addTransformationMethodsToPrototype(CSG.Connector.prototype);
