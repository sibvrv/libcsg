import {Matrix4x4, TransformationMethods, Vector2} from '.';

export type TVector3Universal = Vector3 | Vector2 | { x?: number | string, y?: number | string, z?: number | string } | [number, number, number] | number[];

/** Class Vector3
 * Represents a 3D vector with X, Y, Z coordinates.
 * @constructor
 *
 * @example
 * new CSG.Vector3(1, 2, 3);
 * new CSG.Vector3([1, 2, 3]);
 * new CSG.Vector3({ x: 1, y: 2, z: 3 });
 * new CSG.Vector3(1, 2); // assumes z=0
 * new CSG.Vector3([1, 2]); // assumes z=0
 */
export class Vector3 extends TransformationMethods {
  _x: number;
  _y: number;
  _z: number;
// This does the same as new Vector3(x,y,z) but it doesn't go through the constructor
// and the parameters are not validated. Is much faster.
  static Create(x: number, y: number, z: number) {
    return new Vector3(x, y, z);
  };

  /**
   * Vector3 Constructor
   */
  constructor(x?: number | string | TVector3Universal, y?: number | string, z?: number | string) {
    super();
    if (typeof x === 'object') {
      if (Array.isArray(x)) {
        this._x = x[0] || 0;
        this._y = x[1] || 0;
        this._z = x[2] || 0;
      } else if (x instanceof Vector2) {
        this._x = x.x;
        this._y = x.y;
        this._z = 0;
      } else if (x instanceof Vector3) {
        this._x = x.x;
        this._y = x.y;
        this._z = x.z;
      } else {
        this._x = ('x' in x ? (typeof x.x === 'string' ? parseFloat(x.x) : x.x) : 0) || 0;
        this._y = ('y' in x ? (typeof x.y === 'string' ? parseFloat(x.y) : x.y) : 0) || 0;
        this._z = ('z' in x ? (typeof x.z === 'string' ? parseFloat(x.z) : x.z) : 0) || 0;
      }
    } else {
      this._x = (typeof x === 'string' ? parseFloat(x) : x) || 0;
      this._y = (typeof y === 'string' ? parseFloat(y) : y) || 0;
      this._z = (typeof z === 'string' ? parseFloat(z) : z) || 0;
    }
  }

  set x(v) {
    throw new Error('Vector3 is immutable');
  }

  get x() {
    return this._x;
  }

  set y(v) {
    throw new Error('Vector3 is immutable');
  }

  get y() {
    return this._y;
  }

  set z(v) {
    throw new Error('Vector3 is immutable');
  }

  get z() {
    return this._z;
  }

  clone() {
    return Vector3.Create(this._x, this._y, this._z);
  }

  negated() {
    return Vector3.Create(-this._x, -this._y, -this._z);
  }

  abs() {
    return Vector3.Create(Math.abs(this._x), Math.abs(this._y), Math.abs(this._z));
  }

  plus(a: Vector3) {
    return Vector3.Create(this._x + a._x, this._y + a._y, this._z + a._z);
  }

  minus(a: Vector3) {
    return Vector3.Create(this._x - a._x, this._y - a._y, this._z - a._z);
  }

  times(a: number) {
    return Vector3.Create(this._x * a, this._y * a, this._z * a);
  }

  dividedBy(a: number) {
    return Vector3.Create(this._x / a, this._y / a, this._z / a);
  }

  dot(a: Vector3) {
    return this._x * a._x + this._y * a._y + this._z * a._z;
  }

  lerp(a: Vector3, t: number) {
    return this.plus(a.minus(this).times(t));
  }

  lengthSquared() {
    return this.dot(this);
  }

  length() {
    return Math.sqrt(this.lengthSquared());
  }

  unit() {
    return this.dividedBy(this.length());
  }

  cross(a: Vector3) {
    return Vector3.Create(
      this._y * a._z - this._z * a._y, this._z * a._x - this._x * a._z, this._x * a._y - this._y * a._x);
  }

  distanceTo(a: Vector3) {
    return this.minus(a).length();
  }

  distanceToSquared(a: Vector3) {
    return this.minus(a).lengthSquared();
  }

  equals(a: Vector3) {
    return (this._x === a._x) && (this._y === a._y) && (this._z === a._z);
  }

  // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
  // Returns a new Vector3
  multiply4x4(matrix4x4: Matrix4x4) {
    return matrix4x4.leftMultiply1x3Vector(this);
  }

  transform(matrix4x4: Matrix4x4): Vector3 {
    return matrix4x4.leftMultiply1x3Vector(this);
  }

  toString() {
    return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ', ' + this._z.toFixed(5) + ')';
  }

  // find a vector that is somewhat perpendicular to this one
  randomNonParallelVector() {
    const abs = this.abs();
    if ((abs._x <= abs._y) && (abs._x <= abs._z)) {
      return Vector3.Create(1, 0, 0);
    } else if ((abs._y <= abs._x) && (abs._y <= abs._z)) {
      return Vector3.Create(0, 1, 0);
    } else {
      return Vector3.Create(0, 0, 1);
    }
  }

  min(p: Vector3) {
    return Vector3.Create(
      Math.min(this._x, p._x), Math.min(this._y, p._y), Math.min(this._z, p._z));
  }

  max(p: Vector3) {
    return Vector3.Create(
      Math.max(this._x, p._x), Math.max(this._y, p._y), Math.max(this._z, p._z));
  }
}
