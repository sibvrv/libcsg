import {Connector} from './Connector';
import {Vertex3 as Vertex3D} from './math/Vertex3';
import {Vector2 as Vector2D} from './math/Vector2';
import {Vector3 as Vector3D} from './math/Vector3';
import {Polygon} from './math/Polygon3';

import {fromPolygons} from './CSGFactories';
import {fromFakeCSG, fromSides, fromObject, fromPoints, fromPointsNoCheck, fromPath2, fromCompactBinary} from './CAGFactories';

import {canonicalize} from './utils/canonicalize';
import {reTesselate} from './utils/retesellate';
import {hasPointInside, isCAGValid, isSelfIntersecting} from './utils/cagValidation';
import {area, getBounds} from './utils/cagMeasurements';
// all of these are good candidates for elimination in this scope, since they are part of a functional api
import {overCutInsideCorners} from '../api/ops-cnc';
import {extrude, extrudeInOrthonormalBasis, extrudeInPlane, rotateExtrude} from '../modifiers/extrusions/';
import {cagOutlinePaths} from '../api/cagOutlinePaths';
import {center} from '../api/center';
import {contract, expand, expandedShellOfCAG} from '../modifiers/expansions';

import {circle, ellipse, rectangle, roundedRectangle} from '../primitives/csg/primitives2d';

import {Vertex2} from './math/Vertex2';
import {Side} from './math/Side';
import {TransformationMethods} from './TransformationMethods';

/**
 * Class CAG
 * Holds a solid area geometry like CSG but 2D.
 * Each area consists of a number of sides.
 * Each side is a line between 2 points.
 * @constructor
 */
export class CAG extends TransformationMethods {
  sides: Side[] = [];
  isCanonicalized = false;

  union(cag) {
    let cags;
    if (cag instanceof Array) {
      cags = cag;
    } else {
      cags = [cag];
    }
    let r = this._toCSGWall(-1, 1);
    r = r.union(
      cags.map((cag) => {
        return cag._toCSGWall(-1, 1).reTesselated();
      }), false, false);
    return fromFakeCSG(r).canonicalized();
  }

  subtract(cag) {
    let cags;
    if (cag instanceof Array) {
      cags = cag;
    } else {
      cags = [cag];
    }
    let r = this._toCSGWall(-1, 1);
    cags.map((cag) => {
      r = r.subtractSub(cag._toCSGWall(-1, 1), false, false);
    });
    r = r.reTesselated();
    r = r.canonicalized();
    r = fromFakeCSG(r);
    r = r.canonicalized();
    return r;
  }

  intersect(cag) {
    let cags;
    if (cag instanceof Array) {
      cags = cag;
    } else {
      cags = [cag];
    }
    let r = this._toCSGWall(-1, 1);
    cags.map((cag) => {
      r = r.intersectSub(cag._toCSGWall(-1, 1), false, false);
    });
    r = r.reTesselated();
    r = r.canonicalized();
    r = fromFakeCSG(r);
    r = r.canonicalized();
    return r;
  }

  transform(matrix4x4) {
    const ismirror = matrix4x4.isMirroring();
    const newsides = this.sides.map((side) => {
      return side.transform(matrix4x4);
    });
    let result = fromSides(newsides);
    if (ismirror) {
      result = result.flipped();
    }
    return result;
  }

  flipped() {
    const newsides = this.sides.map((side) => {
      return side.flipped();
    });
    newsides.reverse();
    return fromSides(newsides);
  }

  // ALIAS !
  center(axes) {
    return center({axes}, [this]);
  }

  // ALIAS !
  expandedShell(radius, resolution) {
    return expandedShellOfCAG(this, radius, resolution);
  }

  // ALIAS !
  expand(radius, resolution) {
    return expand(this, radius, resolution);
  }

  contract(radius, resolution) {
    return contract(this, radius, resolution);
  }

  // ALIAS !
  area() {
    return area(this);
  }

  // ALIAS !
  getBounds() {
    return getBounds(this);
  }

  // ALIAS !
  isSelfIntersecting(debug) {
    return isSelfIntersecting(this, debug);
  }

  // extrusion: all aliases to simple functions
  extrudeInOrthonormalBasis(orthonormalbasis, depth, options) {
    return extrudeInOrthonormalBasis(this, orthonormalbasis, depth, options);
  }

  // ALIAS !
  extrudeInPlane(axis1, axis2, depth, options) {
    return extrudeInPlane(this, axis1, axis2, depth, options);
  }

  // ALIAS !
  extrude(options) {
    return extrude(this, options);
  }

  // ALIAS !
  rotateExtrude(options) { // FIXME options should be optional
    return rotateExtrude(this, options);
  }

  // ALIAS !
  check() {
    return isCAGValid(this);
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
  getOutlinePaths() {
    return cagOutlinePaths(this);
  }

  // ALIAS !
  overCutInsideCorners(cutterradius) {
    return overCutInsideCorners(this, cutterradius);
  }

  // ALIAS !
  hasPointInside(point) {
    return hasPointInside(this, point);
  }

  // All the toXXX functions
  toString() {
    let result = 'CAG (' + this.sides.length + ' sides):\n';
    this.sides.map((side) => {
      result += '  ' + side.toString() + '\n';
    });
    return result;
  }

  _toCSGWall(z0, z1) {
    const polygons = this.sides.map((side) => {
      return side.toPolygon3D(z0, z1);
    });
    return fromPolygons(polygons);
  }

  _toVector3DPairs(m) {
    // transform m
    let pairs = this.sides.map((side) => {
      const p0 = side.vertex0.pos;
      const p1 = side.vertex1.pos;
      return [Vector3D.Create(p0.x, p0.y, 0),
        Vector3D.Create(p1.x, p1.y, 0)];
    });
    if (typeof m !== 'undefined') {
      pairs = pairs.map((pair) => {
        return pair.map((v) => {
          return v.transform(m);
        });
      });
    }
    return pairs;
  }

  /*
    * transform a cag into the polygons of a corresponding 3d plane, positioned per options
    * Accepts a connector for plane positioning, or optionally
    * single translation, axisVector, normalVector arguments
    * (toConnector has precedence over single arguments if provided)
    */
  _toPlanePolygons(options) {
    const defaults = {
      flipped: false,
    };
    options = Object.assign({}, defaults, options);
    const {flipped} = options;
    // reference connector for transformation
    const origin = [0, 0, 0];
    const defaultAxis = [0, 0, 1];
    const defaultNormal = [0, 1, 0];
    const thisConnector = new Connector(origin, defaultAxis, defaultNormal);
    // translated connector per options
    const translation = options.translation || origin;
    const axisVector = options.axisVector || defaultAxis;
    const normalVector = options.normalVector || defaultNormal;
    // will override above if options has toConnector
    const toConnector = options.toConnector ||
      new Connector(translation, axisVector, normalVector);
    // resulting transform
    const m = thisConnector.getTransformationTo(toConnector, false, 0);
    // create plane as a (partial non-closed) CSG in XY plane
    const bounds = this.getBounds();
    bounds[0] = bounds[0].minus(new Vector2D(1, 1));
    bounds[1] = bounds[1].plus(new Vector2D(1, 1));
    const csgshell = this._toCSGWall(-1, 1);
    let csgplane = fromPolygons([new Polygon([
      new Vertex3D(new Vector3D(bounds[0].x, bounds[0].y, 0)),
      new Vertex3D(new Vector3D(bounds[1].x, bounds[0].y, 0)),
      new Vertex3D(new Vector3D(bounds[1].x, bounds[1].y, 0)),
      new Vertex3D(new Vector3D(bounds[0].x, bounds[1].y, 0)),
    ])]);
    if (flipped) {
      csgplane = csgplane.invert();
    }
    // intersectSub -> prevent premature retesselate/canonicalize
    csgplane = csgplane.intersectSub(csgshell);
    // only keep the polygons in the z plane:
    const polys = csgplane.polygons.filter((polygon) => {
      return Math.abs(polygon.plane.normal.z) > 0.99;
    });
    // add uv vectors, corresponding with the x and y coordinates of the
    // points defining the original CAG
    polys.forEach((poly) => {
      poly.vertices.forEach((vertex) => {
        vertex.uv = new Vector2D(vertex.pos.x, vertex.pos.y);
      });
    });

    // finally, position the plane per passed transformations
    return polys.map((poly) => {
      return poly.transform(m);
    });
  }

  /*
    * given 2 connectors, this returns all polygons of a "wall" between 2
    * copies of this cag, positioned in 3d space as "bottom" and
    * "top" plane per connectors toConnector1, and toConnector2, respectively
    */
  _toWallPolygons(options, iteration = 0) {
    // normals are going to be correct as long as toConn2.point - toConn1.point
    // points into cag normal direction (check in caller)
    // arguments: options.toConnector1, options.toConnector2, options.cag
    //     walls go from toConnector1 to toConnector2
    //     optionally, target cag to point to - cag needs to have same number of sides as this!
    const origin = [0, 0, 0];
    const defaultAxis = [0, 0, 1];
    const defaultNormal = [0, 1, 0];
    const thisConnector = new Connector(origin, defaultAxis, defaultNormal);
    // arguments:
    const toConnector1 = options.toConnector1;
    // let toConnector2 = new Connector([0, 0, -30], defaultAxis, defaultNormal);
    const toConnector2 = options.toConnector2;
    if (!(toConnector1 instanceof Connector && toConnector2 instanceof Connector)) {
      throw new Error('could not parse Connector arguments toConnector1 or toConnector2');
    }
    if (options.cag) {
      if (options.cag.sides.length !== this.sides.length) {
        throw new Error('target cag needs same sides count as start cag');
      }
    }
    // target cag is same as this unless specified
    const toCag = options.cag || this;
    const m1 = thisConnector.getTransformationTo(toConnector1, toConnector1.axisvector.z < 0, 0);
    const m2 = thisConnector.getTransformationTo(toConnector2, toConnector2.axisvector.z < 0, 0);
    const vps1 = this._toVector3DPairs(m1);
    let vps2 = toCag._toVector3DPairs(m2);
    const hasMirroredNormals = toConnector1.axisvector.z < 0;

    // group the Vector3DPairs by 2D polygon in case of multi-array cag
    const vps1List = [];
    const vps2List = [];
    let vps1Temp = [vps1[0]];
    let vps2Temp = [vps2[0]];
    let i = 0;
    for (i = 1; i < vps1.length; ++i) {
      if (!(vps1[i][1].equals(vps1[i - 1][0]) || vps1[i][0].equals(vps1[i - 1][1]))) {
        vps1List.push(vps1Temp);
        vps1Temp = [];
        vps2List.push(vps2Temp);
        vps2Temp = [];
      }
      vps1Temp.push(vps1[i]);
      vps2Temp.push(vps2[i]);
    }
    vps1List.push(vps1Temp);
    vps2List.push(vps2Temp);

    // calculate UV coordinates for each extruded side
    const polygons = [];
    vps1List.forEach((vps1, i) => {
      let xbot0 = 0;
      let xtop0 = 0;
      vps2 = vps2List[i];
      vps1.forEach((vp1, j) => {
        const xbot1 = xbot0 + vp1[0].distanceTo(vp1[1]);
        const xtop1 = xtop0 + vps2[j][0].distanceTo(vps2[j][1]);
        const y0 = vp1[0].distanceTo(vps2[j][0]);
        const y1 = vp1[1].distanceTo(vps2[j][1]);
        const polygon1 = new Polygon(
          [Vertex3D.fromPosAndUV(vps2[j][1], new Vector2D(xtop1, y1 * (1 + iteration))),
            Vertex3D.fromPosAndUV(vps2[j][0], new Vector2D(xtop0, y0 * (1 + iteration))),
            Vertex3D.fromPosAndUV(vp1[0], new Vector2D(xbot0, y0 * iteration))]);
        const polygon2 = new Polygon(
          [Vertex3D.fromPosAndUV(vps2[j][1], new Vector2D(xtop1, y1 * (1 + iteration))),
            Vertex3D.fromPosAndUV(vp1[0], new Vector2D(xbot0, y0 * iteration)),
            Vertex3D.fromPosAndUV(vp1[1], new Vector2D(xbot1, y1 * iteration))]);
        if (hasMirroredNormals) {
          polygon1.plane = polygon1.plane.flipped();
          polygon2.plane = polygon2.plane.flipped();
        }
        polygons.push(polygon1);
        polygons.push(polygon2);
        xbot0 = xbot1;
        xtop0 = xtop1;
      });
    });
    return polygons;
  }

  /**
   * Convert to a list of points.
   * @return {points[]} list of points in 2D space
   */
  toPoints() {
    const points = this.sides.map((side) => {
      const v0 = side.vertex0;
      // let v1 = side.vertex1
      return v0.pos;
    });
    // due to the logic of fromPoints()
    // move the first point to the last
    if (points.length > 0) {
      points.push(points.shift());
    }
    return points;
  }

  /** Convert to compact binary form.
   * See fromCompactBinary.
   * @return {CompactBinary}
   */
  toCompactBinary() {
    const cag = this.canonicalized();
    const numsides = cag.sides.length;
    const vertexmap = {};
    const vertices = [];
    let numvertices = 0;
    const sideVertexIndices = new Uint32Array(2 * numsides);
    let sidevertexindicesindex = 0;
    cag.sides.map((side) => {
      [side.vertex0, side.vertex1].map((v) => {
        const vertextag = v.getTag();
        let vertexindex;
        if (!(vertextag in vertexmap)) {
          vertexindex = numvertices++;
          vertexmap[vertextag] = vertexindex;
          vertices.push(v);
        } else {
          vertexindex = vertexmap[vertextag];
        }
        sideVertexIndices[sidevertexindicesindex++] = vertexindex;
      });
    });
    const vertexData = new Float64Array(numvertices * 2);
    let verticesArrayIndex = 0;
    vertices.map((v) => {
      const pos = v.pos;
      vertexData[verticesArrayIndex++] = pos._x;
      vertexData[verticesArrayIndex++] = pos._y;
    });
    const result = {
      'class': 'CAG',
      sideVertexIndices,
      vertexData,
    };
    return result;
  }

  // eek ! all this is kept for backwards compatibility...for now
  static Vertex = Vertex2;
  static Side = Side;

  static circle = circle;
  static ellipse = ellipse;
  static rectangle = rectangle;
  static roundedRectangle = roundedRectangle;

  static fromSides = fromSides;
  static fromObject = fromObject;
  static fromPoints = fromPoints;
  static fromPointsNoCheck = fromPointsNoCheck;
  static fromPath2 = fromPath2;
  static fromFakeCSG = fromFakeCSG;
  static fromCompactBinary = fromCompactBinary;
}