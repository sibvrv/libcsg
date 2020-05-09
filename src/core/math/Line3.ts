import {EPS} from '../constants';
import {solve2Linear} from '../utils';
import {Matrix4x4, Plane, TransformationMethods, TVector3Universal, Vector3} from '.';

// # class Line3D
// Represents a line in 3D space
// direction must be a unit vector
// point is a random point on the line
export class Line3D extends TransformationMethods {
  point: Vector3;
  direction: Vector3;

  static fromPoints(_p1: TVector3Universal, _p2: TVector3Universal) {
    const p1 = new Vector3(_p1);
    const p2 = new Vector3(_p2);
    const direction = p2.minus(p1);
    return new Line3D(p1, direction);
  }

  static fromPlanes(p1: Plane, p2: Plane) {
    let direction = p1.normal.cross(p2.normal);
    const l = direction.length();
    if (l < EPS) {
      throw new Error('Parallel planes');
    }
    direction = direction.times(1.0 / l);

    const mabsx = Math.abs(direction.x);
    const mabsy = Math.abs(direction.y);
    const mabsz = Math.abs(direction.z);
    let origin;
    if ((mabsx >= mabsy) && (mabsx >= mabsz)) {
      // direction vector is mostly pointing towards x
      // find a point p for which x is zero:
      const r = solve2Linear(p1.normal.y, p1.normal.z, p2.normal.y, p2.normal.z, p1.w, p2.w);
      origin = new Vector3(0, r[0], r[1]);
    } else if ((mabsy >= mabsx) && (mabsy >= mabsz)) {
      // find a point p for which y is zero:
      const r = solve2Linear(p1.normal.x, p1.normal.z, p2.normal.x, p2.normal.z, p1.w, p2.w);
      origin = new Vector3(r[0], 0, r[1]);
    } else {
      // find a point p for which z is zero:
      const r = solve2Linear(p1.normal.x, p1.normal.y, p2.normal.x, p2.normal.y, p1.w, p2.w);
      origin = new Vector3(r[0], r[1], 0);
    }
    return new Line3D(origin, direction);
  }

  /**
   * Line3D Constructor
   */
  constructor(point: TVector3Universal, direction: TVector3Universal) {
    super();
    this.point = new Vector3(point);
    this.direction = new Vector3(direction).unit();
  }

  intersectWithPlane(plane: Plane) {
    // plane: plane.normal * p = plane.w
    // line: p=line.point + labda * line.direction
    const labda = (plane.w - plane.normal.dot(this.point)) / plane.normal.dot(this.direction);
    const point = this.point.plus(this.direction.times(labda));
    return point;
  }

  clone(line: Line3D) {
    return new Line3D(this.point.clone(), this.direction.clone());
  }

  reverse() {
    return new Line3D(this.point.clone(), this.direction.negated());
  }

  transform(matrix4x4: Matrix4x4): Line3D {
    const newpoint = this.point.multiply4x4(matrix4x4);
    const pointPlusDirection = this.point.plus(this.direction);
    const newPointPlusDirection = pointPlusDirection.multiply4x4(matrix4x4);
    const newdirection = newPointPlusDirection.minus(newpoint);
    return new Line3D(newpoint, newdirection);
  }

  closestPointOnLine(_point: TVector3Universal) {
    const point = new Vector3(_point);
    const t = point.minus(this.point).dot(this.direction) / this.direction.dot(this.direction);
    const closestpoint = this.point.plus(this.direction.times(t));
    return closestpoint;
  }

  distanceToPoint(_point: TVector3Universal) {
    const point = new Vector3(_point);
    const closestpoint = this.closestPointOnLine(point);
    const distancevector = point.minus(closestpoint);
    const distance = distancevector.length();
    return distance;
  }

  equals(line3d: Line3D) {
    if (!this.direction.equals(line3d.direction)) return false;
    const distance = this.distanceToPoint(line3d.point);

    if (distance > EPS) {
      return false;
    }
    return true;
  }
}
