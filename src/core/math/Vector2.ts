import {Matrix4x4, TransformationMethods, Vector3} from '.';

export type TVector2Universal = Vector2 | Vector3 | [number, number] | number[] | { x?: number | string, y?: number | string };

/**
 * Represents a 2D vector with X, Y coordinates
 * @class Vector2
 * @constructor
 *
 * @example
 * new CSG.Vector2(1, 2);
 * new CSG.Vector2([1, 2]);
 * new CSG.Vector2({ x: 1, y: 2});
 */
export class Vector2 extends TransformationMethods {
  _x: number;
  _y: number;

  /**
   * make from angle
   * @param radians
   */
  static fromAngle(radians: number) {
    return Vector2.fromAngleRadians(radians);
  };

  /**
   * make from angle in degrees
   * @param degrees
   */
  static fromAngleDegrees(degrees: number) {
    const radians = Math.PI * degrees / 180;
    return Vector2.fromAngleRadians(radians);
  };

  /**
   * make from angle in radians
   * @param radians
   */
  static fromAngleRadians(radians: number) {
    return Vector2.Create(Math.cos(radians), Math.sin(radians));
  };

  /**
   * This does the same as new Vector2(x,y) but it doesn't go through the constructor and the parameters are not validated. Is much faster.
   * @param x
   * @param y
   * @constructor
   */
  static Create(x: number, y: number) {
    return new Vector2(x, y);
  };

  /**
   * Vector2 Constructor
   * @param x
   * @param y
   */
  constructor(x?: number | string | TVector2Universal, y?: number | string) {
    super();
    if (typeof x === 'object' && x !== null) {
      if (Array.isArray(x)) {
        this._x = x[0] || 0;
        this._y = x[1] || 0;
      } else if (x instanceof Vector2 || x instanceof Vector3) {
        this._x = x.x;
        this._y = x.y;
      } else {
        this._x = ('x' in x ? (typeof x.x === 'string' ? parseFloat(x.x) : x.x) : 0) || 0;
        this._y = ('y' in x ? (typeof x.y === 'string' ? parseFloat(x.y) : x.y) : 0) || 0;
      }
    } else {
      this._x = (typeof x === 'string' ? parseFloat(x) : x) || 0;
      this._y = (typeof y === 'string' ? parseFloat(y) : y) || 0;
    }
// throw new Error('wrong arguments');
  }

  /**
   * Get X
   */
  get x() {
    return this._x;
  }

  /**
   * Set X is not allowed, Vector2 is immutable
   * @param v
   */
  set x(v: number) {
    throw new Error('Vector2 is immutable');
  }

  /**
   * Get Y
   */
  get y() {
    return this._y;
  }

  /**
   * Set Y is not allowed, Vector2 is immutable
   * @param v
   */
  set y(v: number) {
    throw new Error('Vector2 is immutable');
  }

  /**
   * extend to a 3D vector by adding a z coordinate:
   * @param z
   */
  toVector3D(z = 0) {
    return new Vector3(this._x, this._y, z);
  }

  /**
   * is vectors equal
   * @param a
   */
  equals(a: Vector2) {
    return (this._x === a._x) && (this._y === a._y);
  }

  /**
   * Clone
   */
  clone() {
    return Vector2.Create(this._x, this._y);
  }

  /**
   * return negated vector
   */
  negated() {
    return Vector2.Create(-this._x, -this._y);
  }

  /**
   * Plus
   * @param a
   */
  plus(a: Vector2) {
    return Vector2.Create(this._x + a._x, this._y + a._y);
  }

  /**
   * Minus
   * @param a
   */
  minus(a: Vector2) {
    return Vector2.Create(this._x - a._x, this._y - a._y);
  }

  /**
   * scalar scale
   * @param a
   */
  times(a: number) {
    return Vector2.Create(this._x * a, this._y * a);
  }

  /**
   * divided by value
   * @param a
   */
  dividedBy(a: number) {
    return Vector2.Create(this._x / a, this._y / a);
  }

  /**
   * Find The Dot Product Of Two Vectors
   * @param a
   */
  dot(a: Vector2) {
    return this._x * a._x + this._y * a._y;
  }

  /**
   * Lerp
   * @param a
   * @param t
   */
  lerp(a: Vector2, t: number) {
    return this.plus(a.minus(this).times(t));
  }

  /**
   * Vector length
   */
  length() {
    return Math.sqrt(this.dot(this));
  }

  /**
   * Distance to point
   * @param a
   */
  distanceTo(a: Vector2) {
    return this.minus(a).length();
  }

  /**
   * Squared distance between two points
   * @param a
   */
  distanceToSquared(a: Vector2) {
    return this.minus(a).lengthSquared();
  }

  /**
   * Squared Length
   */
  lengthSquared() {
    return this.dot(this);
  }

  /**
   * Unit Vector
   */
  unit() {
    return this.dividedBy(this.length());
  }

  /**
   * Cross product
   * @param a
   */
  cross(a: Vector2) {
    return this._x * a._y - this._y * a._x;
  }

  /**
   * returns the vector rotated by 90 degrees clockwise
   */
  normal() {
    return Vector2.Create(this._y, -this._x);
  }

  /**
   * Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
   * Returns a new Vector2
   * @param matrix4x4
   */
  multiply4x4(matrix4x4: Matrix4x4) {
    return matrix4x4.leftMultiply1x2Vector(this);
  }

  /**
   * Transform helper
   * @param matrix4x4
   */
  transform(matrix4x4: Matrix4x4): Vector2 {
    return matrix4x4.leftMultiply1x2Vector(this);
  }

  /**
   * Get rotation angle in radians
   */
  angle() {
    return this.angleRadians();
  }

  /**
   * Get rotation angle in degrees
   */
  angleDegrees() {
    const radians = this.angleRadians();
    return 180 * radians / Math.PI;
  }

  /**
   * Get rotation angle in radians
   */
  angleRadians() {
    // y=sin, x=cos
    return Math.atan2(this._y, this._x);
  }

  /**
   * get min vector components
   * @param p
   */
  min(p: Vector2) {
    return Vector2.Create(
      Math.min(this._x, p._x), Math.min(this._y, p._y));
  }

  /**
   * get max vector components
   * @param p
   */
  max(p: Vector2) {
    return Vector2.Create(
      Math.max(this._x, p._x), Math.max(this._y, p._y));
  }

  /**
   * To String helper
   */
  toString() {
    return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ')';
  }

  /**
   * Module of a vector
   */
  abs() {
    return Vector2.Create(Math.abs(this._x), Math.abs(this._y));
  }
}
