import {Vector3} from './Vector3';
import {TransformationMethods} from '../TransformationMethods';
import {Matrix4x4} from './Matrix4';

/** Class Vector2
 * Represents a 2D vector with X, Y coordinates
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

  static fromAngle(radians: number) {
    return Vector2.fromAngleRadians(radians);
  };

  static fromAngleDegrees(degrees: number) {
    const radians = Math.PI * degrees / 180;
    return Vector2.fromAngleRadians(radians);
  };

  static fromAngleRadians(radians: number) {
    return Vector2.Create(Math.cos(radians), Math.sin(radians));
  };

// This does the same as new Vector2(x,y) but it doesn't go through the constructor
// and the parameters are not validated. Is much faster.
  static Create(x: number, y: number) {
    return new Vector2(x, y);
  };

  constructor(x?: number | Vector2 | Vector3 | [number, number] | { x: number | string, y: number | string } | string, y?: number | string) {
    super();
    if (typeof x === 'object' && x !== null) {
      if (Array.isArray(x)) {
        this._x = x[0] || 0;
        this._y = x[1] || 0;
      } else if (x instanceof Vector2 || x instanceof Vector3) {
        this._x = x.x;
        this._y = x.y;
      } else {
        this._x = 'x' in x ? (typeof x.x === 'string' ? parseFloat(x.x) : x.x) : 0;
        this._y = 'y' in x ? (typeof x.y === 'string' ? parseFloat(x.y) : x.y) : 0;
      }
    } else {
      this._x = (typeof x === 'string' ? parseFloat(x) : x) || 0;
      this._y = (typeof y === 'string' ? parseFloat(y) : y) || 0;
    }
// throw new Error('wrong arguments');
  }

  get x() {
    return this._x;
  }

  set x(v: number) {
    throw new Error('Vector2 is immutable');
  }

  get y() {
    return this._y;
  }

  set y(v: number) {
    throw new Error('Vector2 is immutable');
  }

  // extend to a 3D vector by adding a z coordinate:
  toVector3D(z = 0) {
    return new Vector3(this._x, this._y, z);
  }

  equals(a: Vector2) {
    return (this._x === a._x) && (this._y === a._y);
  }

  clone() {
    return Vector2.Create(this._x, this._y);
  }

  negated() {
    return Vector2.Create(-this._x, -this._y);
  }

  plus(a: Vector2) {
    return Vector2.Create(this._x + a._x, this._y + a._y);
  }

  minus(a: Vector2) {
    return Vector2.Create(this._x - a._x, this._y - a._y);
  }

  times(a: number) {
    return Vector2.Create(this._x * a, this._y * a);
  }

  dividedBy(a: number) {
    return Vector2.Create(this._x / a, this._y / a);
  }

  dot(a: Vector2) {
    return this._x * a._x + this._y * a._y;
  }

  lerp(a: Vector2, t: number) {
    return this.plus(a.minus(this).times(t));
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  distanceTo(a: Vector2) {
    return this.minus(a).length();
  }

  distanceToSquared(a: Vector2) {
    return this.minus(a).lengthSquared();
  }

  lengthSquared() {
    return this.dot(this);
  }

  unit() {
    return this.dividedBy(this.length());
  }

  cross(a: Vector2) {
    return this._x * a._y - this._y * a._x;
  }

  // returns the vector rotated by 90 degrees clockwise
  normal() {
    return Vector2.Create(this._y, -this._x);
  }

  // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
  // Returns a new Vector2
  multiply4x4(matrix4x4: Matrix4x4) {
    return matrix4x4.leftMultiply1x2Vector(this);
  }

  transform(matrix4x4: Matrix4x4) {
    return matrix4x4.leftMultiply1x2Vector(this);
  }

  angle() {
    return this.angleRadians();
  }

  angleDegrees() {
    const radians = this.angleRadians();
    return 180 * radians / Math.PI;
  }

  angleRadians() {
    // y=sin, x=cos
    return Math.atan2(this._y, this._x);
  }

  min(p: Vector2) {
    return Vector2.Create(
      Math.min(this._x, p._x), Math.min(this._y, p._y));
  }

  max(p: Vector2) {
    return Vector2.Create(
      Math.max(this._x, p._x), Math.max(this._y, p._y));
  }

  toString() {
    return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ')';
  }

  abs() {
    return Vector2.Create(Math.abs(this._x), Math.abs(this._y));
  }
}
