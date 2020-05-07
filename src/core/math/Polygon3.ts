import {Vector2} from './Vector2';
import {TVector3Universal, Vector3} from './Vector3';
import {Vertex3} from './Vertex3';
import {Matrix4x4} from './Matrix4';
import {_CSGDEBUG, areaEPS, EPS} from '../constants';
import {Plane} from './Plane';
import {CAG} from '../CAG';
import {ISolidFromSlices, solidFromSlices} from '../../api/solidFromSlices';
import {fromPolygons} from '../CSGFactories';
import {fromPointsNoCheck} from '../CAGFactories';
import {PolygonShared} from './PolygonShared';
import {TransformationMethods} from '../TransformationMethods';
import {OrthoNormalBasis} from './OrthoNormalBasis';

/** Class Polygon
 * Represents a convex polygon. The vertices used to initialize a polygon must
 *   be coplanar and form a convex loop. They do not have to be `Vertex`
 *   instances but they must behave similarly (duck typing can be used for
 *   customization).
 * <br>
 * Each convex polygon has a `shared` property, which is shared between all
 *   polygons that are clones of each other or were split from the same polygon.
 *   This can be used to define per-polygon properties (such as surface color).
 * <br>
 * The plane of the polygon is calculated from the vertex coordinates if not provided.
 *   The plane can alternatively be passed as the third argument to avoid calculations.
 *
 * @constructor
 * @param {Vertex[]} vertices - list of vertices
 * @param {Polygon3.Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 *
 * @example
 * const vertices = [
 *   new CSG.Vertex(new CSG.Vector3([0, 0, 0])),
 *   new CSG.Vertex(new CSG.Vector3([0, 10, 0])),
 *   new CSG.Vertex(new CSG.Vector3([0, 10, 10]))
 * ]
 * let observed = new Polygon(vertices)
 */
export class Polygon3 extends TransformationMethods {
  vertices: Vertex3[];
  shared: PolygonShared;
  plane: Plane;
  cachedBoundingBox?: [Vector3, Vector3];
  cachedBoundingSphere?: [Vector3, number];

  static defaultShared = new PolygonShared(null);
  static Shared = PolygonShared;

// create from an untyped object with identical property names:
  static fromObject<T extends Polygon3 | { vertices: Vertex3[], shared?: PolygonShared, plane?: Plane }>(obj: T) {
    const vertices = obj.vertices.map((v: Vertex3) => {
      return Vertex3.fromObject(v);
    });
    const shared = Polygon3.Shared.fromObject(obj.shared);
    const plane = obj.plane ? Plane.fromObject(obj.plane) : Plane.fromVector3Ds(vertices[0].pos, vertices[1].pos, vertices[2].pos);
    return new Polygon3(vertices, shared, plane);
  }

  /** Create a polygon from the given points.
   *
   * @param {Array[]} points - list of points
   * @param {Polygon3.Shared} [shared=defaultShared] - shared property to apply
   * @param {Plane} [plane] - plane of the polygon
   *
   * @example
   * const points = [
   *   [0,  0, 0],
   *   [0, 10, 0],
   *   [0, 10, 10]
   * ]
   * let observed = CSG.Polygon3.createFromPoints(points)
   */
  static createFromPoints(points: TVector3Universal[], shared?: PolygonShared, plane?: Plane) {
    // FIXME : this circular dependency does not work !
    // const {fromPoints} = require('./polygon3Factories')
    // return fromPoints(points, shared, plane)
    const vertices: Vertex3[] = [];
    points.map((p) => {
      const vec = new Vector3(p);
      const vertex = new Vertex3(vec);
      vertices.push(vertex);
    });

    const polygon = plane ? new Polygon3(vertices, shared, plane) : new Polygon3(vertices, shared);
    return polygon;
  }

  static verticesConvex(vertices: Vertex3[], planenormal: Vector3) {
    const numvertices = vertices.length;
    if (numvertices > 2) {
      let prevprevpos = vertices[numvertices - 2].pos;
      let prevpos = vertices[numvertices - 1].pos;
      for (let i = 0; i < numvertices; i++) {
        const pos = vertices[i].pos;
        if (!Polygon3.isConvexPoint(prevprevpos, prevpos, pos, planenormal)) {
          return false;
        }
        prevprevpos = prevpos;
        prevpos = pos;
      }
    }
    return true;
  }

// calculate whether three points form a convex corner
//  prevpoint, point, nextpoint: the 3 coordinates (Vector3 instances)
//  normal: the normal vector of the plane
  static isConvexPoint(prevpoint: Vector3, point: Vector3, nextpoint: Vector3, normal: Vector3) {
    const crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point));
    const crossdotnormal = crossproduct.dot(normal);
    return (crossdotnormal >= 0);
  };

  static isStrictlyConvexPoint(prevpoint: Vector3, point: Vector3, nextpoint: Vector3, normal: Vector3) {
    const crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point));
    const crossdotnormal = crossproduct.dot(normal);
    return (crossdotnormal >= EPS);
  };

  /**
   * Polygon3 Constructor
   */
  constructor(vertices: Vertex3[], shared?: PolygonShared | null, plane?: Plane) {
    super();

    this.vertices = vertices;
    this.shared = shared ? shared : Polygon3.defaultShared;
    this.plane = plane ? plane : Plane.fromVector3Ds(vertices[0].pos, vertices[1].pos, vertices[2].pos);

    // let numvertices = vertices.length;

    if (_CSGDEBUG) {
      if (!this.checkIfConvex()) {
        throw new Error('Not convex!');
      }
    }
  }

  /** Check whether the polygon is convex. (it should be, otherwise we will get unexpected results)
   * @returns {boolean}
   */
  checkIfConvex() {
    return Polygon3.verticesConvex(this.vertices, this.plane.normal);
  }

  // FIXME what? why does this return this, and not a new polygon?
  // FIXME is this used?
  setColor(...args: any[]) {
    this.shared = Polygon3.Shared.fromColor(...args);
    return this;
  }

  getSignedVolume() {
    let signedVolume = 0;
    for (let i = 0; i < this.vertices.length - 2; i++) {
      signedVolume += this.vertices[0].pos.dot(this.vertices[i + 1].pos
        .cross(this.vertices[i + 2].pos));
    }
    signedVolume /= 6;
    return signedVolume;
  }

  // Note: could calculate vectors only once to speed up
  getArea() {
    let polygonArea = 0;
    for (let i = 0; i < this.vertices.length - 2; i++) {
      polygonArea += this.vertices[i + 1].pos.minus(this.vertices[0].pos)
        .cross(this.vertices[i + 2].pos.minus(this.vertices[i + 1].pos)).length();
    }
    polygonArea /= 2;
    return polygonArea;
  }

  // accepts array of features to calculate
  // returns array of results
  getTetraFeatures(features: string[]) {
    const result: any[] = [];
    features.forEach((feature) => {
      if (feature === 'volume') {
        result.push(this.getSignedVolume());
      } else if (feature === 'area') {
        result.push(this.getArea());
      }
    }, this);
    return result;
  }

  // Extrude a polygon into the direction offsetvector
  // Returns a CSG object
  extrude(offsetvector: Vector3) {
    const newpolygons = [];

    let polygon1: Polygon3 = this;
    const direction = polygon1.plane.normal.dot(offsetvector);
    if (direction > 0) {
      polygon1 = polygon1.flipped();
    }

    newpolygons.push(polygon1);

    let polygon2 = polygon1.translate(offsetvector);

    const numvertices = this.vertices.length;
    let x = 0;

    const y = offsetvector.length();
    for (let i = 0; i < numvertices; i++) {
      const sidefacepoints = [];
      const nexti = (i < (numvertices - 1)) ? i + 1 : 0;
      const xn = x + polygon1.vertices[i].pos.distanceTo(polygon1.vertices[nexti].pos);
      sidefacepoints.push(Vertex3.fromPosAndUV(polygon1.vertices[i].pos, new Vector2(x, 0)));
      sidefacepoints.push(Vertex3.fromPosAndUV(polygon2.vertices[i].pos, new Vector2(x, y)));
      sidefacepoints.push(Vertex3.fromPosAndUV(polygon2.vertices[nexti].pos, new Vector2(xn, y)));
      sidefacepoints.push(Vertex3.fromPosAndUV(polygon1.vertices[nexti].pos, new Vector2(xn, 0)));

      const sidefacepolygon = new Polygon3(sidefacepoints, this.shared);
      newpolygons.push(sidefacepolygon);
      x = xn;
    }
    polygon2 = polygon2.flipped();
    newpolygons.push(polygon2);
    return fromPolygons(newpolygons);
  }

  translate(offset: TVector3Universal) {
    return this.transform(Matrix4x4.translation(offset));
  }

  // returns an array with a Vector3 (center point) and a radius
  boundingSphere() {
    if (!this.cachedBoundingSphere) {
      const box = this.boundingBox();
      const middle = box[0].plus(box[1]).times(0.5);
      const radius3 = box[1].minus(middle);
      const radius = radius3.length();
      this.cachedBoundingSphere = [middle, radius];
    }
    return this.cachedBoundingSphere;
  }

  // returns an array of two Vector3s (minimum coordinates and maximum coordinates)
  boundingBox() {
    if (!this.cachedBoundingBox) {
      let minpoint;
      let maxpoint;
      const vertices = this.vertices;
      const numvertices = vertices.length;
      if (numvertices === 0) {
        minpoint = new Vector3(0, 0, 0);
      } else {
        minpoint = vertices[0].pos;
      }
      maxpoint = minpoint;
      for (let i = 1; i < numvertices; i++) {
        const point = vertices[i].pos;
        minpoint = minpoint.min(point);
        maxpoint = maxpoint.max(point);
      }
      this.cachedBoundingBox = [minpoint, maxpoint];
    }
    return this.cachedBoundingBox;
  }

  flipped() {
    const newvertices = this.vertices.map((v) => {
      return v.flipped();
    });
    newvertices.reverse();
    const newplane = this.plane.flipped();
    return new Polygon3(newvertices, this.shared, newplane);
  }

  // Affine transformation of polygon. Returns a new Polygon
  transform(matrix4x4: Matrix4x4) {
    const newvertices = this.vertices.map((v) => {
      return v.transform(matrix4x4);
    });
    const newplane = this.plane.transform(matrix4x4);
    if (matrix4x4.isMirroring()) {
      // need to reverse the vertex order
      // in order to preserve the inside/outside orientation:
      newvertices.reverse();
    }
    return new Polygon3(newvertices, this.shared, newplane);
  }

  toString() {
    let result = 'Polygon plane: ' + this.plane.toString() + '\n';
    this.vertices.map((vertex) => {
      result += '  ' + vertex.toString() + '\n';
    });
    return result;
  }

  // project the 3D polygon onto a plane
  projectToOrthoNormalBasis(orthobasis: OrthoNormalBasis) {
    const points2d = this.vertices.map((vertex) => {
      return orthobasis.to2D(vertex.pos);
    });

    let result = fromPointsNoCheck(points2d);
    const area = result.area();
    if (Math.abs(area) < areaEPS) {
      // the polygon was perpendicular to the orthnormal plane. The resulting 2D polygon would be degenerate
      // return an empty area instead:
      result = new CAG();
    } else if (area < 0) {
      result = result.flipped();
    }
    return result;
  }

  // ALIAS ONLY!!
  solidFromSlices(options: ISolidFromSlices) {
    return solidFromSlices(this, options);
  }
}
