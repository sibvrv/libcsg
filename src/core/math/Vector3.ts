import {IsFloat} from '../utils';
import {Vector2} from './Vector2';

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
export class Vector3 {
// This does the same as new Vector3(x,y,z) but it doesn't go through the constructor
// and the parameters are not validated. Is much faster.
  static Create(x, y, z) {
    var result = Object.create(Vector3.prototype);
    result._x = x;
    result._y = y;
    result._z = z;
    return result;
  };

  /**
   * Vector3 Constructor
   */
  constructor(x: number | Vector3 | Vector2 | object | [number, number, number], y?: number, z?: number) {
    if (arguments.length === 3) {
      this._x = parseFloat(x);
      this._y = parseFloat(y);
      this._z = parseFloat(z);
    } else if (arguments.length === 2) {
      this._x = parseFloat(x);
      this._y = parseFloat(y);
      this._z = 0;
    } else {
      var ok = true;
      if (arguments.length === 1) {
        if (typeof (x) === 'object') {
          if (x instanceof Vector3) {
            this._x = x._x;
            this._y = x._y;
            this._z = x._z;
          } else if (x instanceof {Vector2}) {
            this._x = x._x;
            this._y = x._y;
            this._z = 0;
          } else if (x instanceof Array) {
            if ((x.length < 2) || (x.length > 3)) {
              ok = false;
            } else {
              this._x = parseFloat(x[0]);
              this._y = parseFloat(x[1]);
              if (x.length === 3) {
                this._z = parseFloat(x[2]);
              } else {
                this._z = 0;
              }
            }
          } else if (('x' in x) && ('y' in x)) {
            this._x = parseFloat(x.x);
            this._y = parseFloat(x.y);
            if ('z' in x) {
              this._z = parseFloat(x.z);
            } else {
              this._z = 0;
            }
          } else if (('_x' in x) && ('_y' in x)) {
            this._x = parseFloat(x._x);
            this._y = parseFloat(x._y);
            if ('_z' in x) {
              this._z = parseFloat(x._z);
            } else {
              this._z = 0;
            }
          } else ok = false;
        } else {
          var v = parseFloat(x);
          this._x = v;
          this._y = v;
          this._z = v;
        }
      } else ok = false;
      if (ok) {
        if ((!IsFloat(this._x)) || (!IsFloat(this._y)) || (!IsFloat(this._z))) ok = false;
      } else {
        throw new Error('wrong arguments');
      }
    }
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get z() {
    return this._z;
  }

  set x(v) {
    throw new Error('Vector3 is immutable');
  }

  set y(v) {
    throw new Error('Vector3 is immutable');
  }

  set z(v) {
    throw new Error('Vector3 is immutable');
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

  plus(a) {
    return Vector3.Create(this._x + a._x, this._y + a._y, this._z + a._z);
  }

  minus(a) {
    return Vector3.Create(this._x - a._x, this._y - a._y, this._z - a._z);
  }

  times(a) {
    return Vector3.Create(this._x * a, this._y * a, this._z * a);
  }

  dividedBy(a) {
    return Vector3.Create(this._x / a, this._y / a, this._z / a);
  }

  dot(a) {
    return this._x * a._x + this._y * a._y + this._z * a._z;
  }

  lerp(a, t) {
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

  cross(a) {
    return Vector3.Create(
      this._y * a._z - this._z * a._y, this._z * a._x - this._x * a._z, this._x * a._y - this._y * a._x);
  }

  distanceTo(a) {
    return this.minus(a).length();
  }

  distanceToSquared(a) {
    return this.minus(a).lengthSquared();
  }

  equals(a) {
    return (this._x === a._x) && (this._y === a._y) && (this._z === a._z);
  }

  // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
  // Returns a new Vector3
  multiply4x4(matrix4x4) {
    return matrix4x4.leftMultiply1x3Vector(this);
  }

  transform(matrix4x4) {
    return matrix4x4.leftMultiply1x3Vector(this);
  }

  toString() {
    return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ', ' + this._z.toFixed(5) + ')';
  }

  // find a vector that is somewhat perpendicular to this one
  randomNonParallelVector() {
    var abs = this.abs();
    if ((abs._x <= abs._y) && (abs._x <= abs._z)) {
      return Vector3.Create(1, 0, 0);
    } else if ((abs._y <= abs._x) && (abs._y <= abs._z)) {
      return Vector3.Create(0, 1, 0);
    } else {
      return Vector3.Create(0, 0, 1);
    }
  }

  min(p) {
    return Vector3.Create(
      Math.min(this._x, p._x), Math.min(this._y, p._y), Math.min(this._z, p._z));
  }

  max(p) {
    return Vector3.Create(
      Math.max(this._x, p._x), Math.max(this._y, p._y), Math.max(this._z, p._z));
  }
}
