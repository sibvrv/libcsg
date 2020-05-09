import {solve2Linear} from '../utils';
import {Matrix4x4, TransformationMethods, TVector2Universal, Vector2} from '.';

/**
 * Line2D
 * Represents a directional line in 2D space
 * A line is parametrized by its normal vector (perpendicular to the line, rotated 90 degrees counter clockwise)
 * and w. The line passes through the point <normal>.times(w).
 * Equation: p is on line if normal.dot(p)==w
 *
 * @param {Vector2} normal normal must be a unit vector!
 * @returns {Line2D}
 */
export class Line2D extends TransformationMethods {
  normal: Vector2;
  w: number;

  static fromPoints(_p1: TVector2Universal, _p2: TVector2Universal) {
    const p1 = new Vector2(_p1);
    const p2 = new Vector2(_p2);
    const direction = p2.minus(p1);
    const normal = direction.normal().negated().unit();
    const w = p1.dot(normal);
    return new Line2D(normal, w);
  };

  /**
   * Line2D Constructor
   */
  constructor(_normal: TVector2Universal, w: number | string) {
    super();
    let normal = new Vector2(_normal);
    w = typeof w === 'string' ? parseFloat(w) : w;
    const l = normal.length();
    // normalize:
    w *= l;
    normal = normal.times(1.0 / l);
    this.normal = normal;
    this.w = w;
  }

  // same line but opposite direction:
  reverse() {
    return new Line2D(this.normal.negated(), -this.w);
  }

  equals(l: Line2D) {
    return (l.normal.equals(this.normal) && (l.w === this.w));
  }

  origin() {
    return this.normal.times(this.w);
  }

  direction() {
    return this.normal.normal();
  }

  xAtY(y: number) {
    // (py == y) && (normal * p == w)
    // -> px = (w - normal._y * y) / normal.x
    const x = (this.w - this.normal._y * y) / this.normal.x;
    return x;
  }

  absDistanceToPoint(point: Vector2 | [number, number]) {
    point = new Vector2(point);
    const pointProjected = point.dot(this.normal);
    const distance = Math.abs(pointProjected - this.w);
    return distance;
  }

  /* FIXME: has error - origin is not defined, the method is never used
   closestPoint: function(point) {
       point = new Vector2(point);
       let vector = point.dot(this.direction());
       return origin.plus(vector);
   },
   */

  // intersection between two lines, returns point as Vector2
  intersectWithLine(line2d: Line2D) {
    const point = solve2Linear(this.normal.x, this.normal.y, line2d.normal.x, line2d.normal.y, this.w, line2d.w);
    return new Vector2(point);
  }

  transform(matrix4x4: Matrix4x4): Line2D {
    const origin = new Vector2(0, 0);
    const pointOnPlane = this.normal.times(this.w);
    const neworigin = origin.multiply4x4(matrix4x4);
    const neworiginPlusNormal = this.normal.multiply4x4(matrix4x4);
    const newnormal = neworiginPlusNormal.minus(neworigin);
    const newpointOnPlane = pointOnPlane.multiply4x4(matrix4x4);
    const neww = newnormal.dot(newpointOnPlane);
    return new Line2D(newnormal, neww);
  }
}

