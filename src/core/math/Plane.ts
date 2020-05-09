import {EPS, getTag} from '@core/constants';
import {Line3D, Matrix4x4, TransformationMethods, TVector3Universal, Vector3} from '.';

// # class Plane
// Represents a plane in 3D space.
export class Plane extends TransformationMethods {
  normal: Vector3;
  w: number;
  tag?: number;

// create from an untyped object with identical property names:
  static fromObject<T extends Plane | { normal: TVector3Universal, w?: number | string }>(obj: T) {
    const normal = new Vector3(obj.normal);
    const w = (typeof obj.w === 'string' ? parseFloat(obj.w) : obj.w) || 0;
    return new Plane(normal, w);
  };

  static fromVector3Ds(a: Vector3, b: Vector3, c: Vector3) {
    const n = b.minus(a).cross(c.minus(a)).unit();
    return new Plane(n, n.dot(a));
  };

// like fromVector3Ds, but allow the vectors to be on one point or one line
// in such a case a random plane through the given points is constructed
  static anyPlaneFromVector3Ds(a: Vector3, b: Vector3, c: Vector3) {
    let v1 = b.minus(a);
    let v2 = c.minus(a);
    if (v1.length() < EPS) {
      v1 = v2.randomNonParallelVector();
    }
    if (v2.length() < EPS) {
      v2 = v1.randomNonParallelVector();
    }
    let normal = v1.cross(v2);
    if (normal.length() < EPS) {
      // this would mean that v1 == v2.negated()
      v2 = v1.randomNonParallelVector();
      normal = v1.cross(v2);
    }
    normal = normal.unit();
    return new Plane(normal, normal.dot(a));
  };

  static fromPoints(_a: TVector3Universal, _b: TVector3Universal, _c: TVector3Universal) {
    const a = new Vector3(_a);
    const b = new Vector3(_b);
    const c = new Vector3(_c);
    return Plane.fromVector3Ds(a, b, c);
  };

  static fromNormalAndPoint(_normal: TVector3Universal, _point: TVector3Universal) {
    const normal = new Vector3(_normal).unit();
    const point = new Vector3(_point);
    const w = point.dot(normal);
    return new Plane(normal, w);
  };

  constructor(normal: Vector3, w: number) {
    super();
    this.normal = normal;
    this.w = w;
  }

  flipped() {
    return new Plane(this.normal.negated(), -this.w);
  }

  getTag() {
    let result = this.tag;
    if (!result) {
      result = getTag();
      this.tag = result;
    }
    return result;
  }

  equals(n: Plane) {
    return this.normal.equals(n.normal) && this.w === n.w;
  }

  transform(matrix4x4: Matrix4x4): Plane {
    const ismirror = matrix4x4.isMirroring();
    // get two vectors in the plane:
    const r = this.normal.randomNonParallelVector();
    const u = this.normal.cross(r);
    const v = this.normal.cross(u);
    // get 3 points in the plane:
    let point1 = this.normal.times(this.w);
    let point2 = point1.plus(u);
    let point3 = point1.plus(v);
    // transform the points:
    point1 = point1.multiply4x4(matrix4x4);
    point2 = point2.multiply4x4(matrix4x4);
    point3 = point3.multiply4x4(matrix4x4);
    // and create a new plane from the transformed points:
    let newplane = Plane.fromVector3Ds(point1, point2, point3);
    if (ismirror) {
      // the transform is mirroring
      // We should mirror the plane:
      newplane = newplane.flipped();
    }
    return newplane;
  }

  // robust splitting of a line by a plane
  // will work even if the line is parallel to the plane
  splitLineBetweenPoints(p1: Vector3, p2: Vector3) {
    const direction = p2.minus(p1);
    let labda = (this.w - this.normal.dot(p1)) / this.normal.dot(direction);
    if (isNaN(labda)) labda = 0;
    if (labda > 1) labda = 1;
    if (labda < 0) labda = 0;
    const result = p1.plus(direction.times(labda));
    return result;
  }

  // returns Vector3D
  intersectWithLine(line3d: Line3D) {
    return line3d.intersectWithPlane(this);
  }

  // intersection of two planes
  intersectWithPlane(plane: Plane) {
    return Line3D.fromPlanes(this, plane);
  }

  signedDistanceToPoint(point: Vector3) {
    return this.normal.dot(point) - this.w;
  }

  toString() {
    return '[normal: ' + this.normal.toString() + ', w: ' + this.w + ']';
  }

  mirrorPoint(point3d: Vector3) {
    const distance = this.signedDistanceToPoint(point3d);
    const mirrored = point3d.minus(this.normal.times(distance * 2.0));
    return mirrored;
  }
}

