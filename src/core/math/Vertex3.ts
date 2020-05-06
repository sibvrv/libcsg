// @ts-nocheck
/* tslint:disable */

import {Vector3} from './Vector3';
import {Vector2} from './Vector2';
import {getTag} from '../constants';
import {TransformationMethods} from '../TransformationMethods';

// # class Vertex
// Represents a vertex of a polygon. Use your own vertex class instead of this
// one to provide additional features like texture coordinates and vertex
// colors. Custom vertex classes need to provide a `pos` property
// `flipped()`, and `interpolate()` methods that behave analogous to the ones
// FIXME: And a lot MORE (see plane.fromVector3s for ex) ! This is fragile code
// defined by `Vertex`.
export class Vertex3 extends TransformationMethods {
  uv = new Vector2(0, 0);
  tag?: number;

// create from an untyped object with identical property names:
  static fromObject(obj) {
    const pos = new Vector3(obj.pos);
    return new Vertex(pos);
  }

// create with position and uv coordinates
  static fromPosAndUV(pos, uv) {
    const newVertex = new Vertex(pos);
    newVertex.uv = uv;
    return newVertex;
  };

  constructor(public pos: Vector3) {
  }

  // Return a vertex with all orientation-specific data (e.g. vertex normal) flipped. Called when the
  // orientation of a polygon is flipped.
  flipped() {
    return this;
  }

  getTag() {
    let result = this.tag;
    if (!result) {
      result = getTag();
      this.tag = result;
    }
    return result;
  }

  // Create a new vertex between this vertex and `other` by linearly
  // interpolating all properties using a parameter of `t`. Subclasses should
  // override this to interpolate additional properties.
  interpolate(other, t) {
    const newpos = this.pos.lerp(other.pos, t);
    const newUv = this.uv.lerp(other.uv, t);
    return Vertex.fromPosAndUV(newpos, newUv);
  }

  // Affine transformation of vertex. Returns a new Vertex
  transform(matrix4x4) {
    const newpos = this.pos.multiply4x4(matrix4x4);
    return Vertex.fromPosAndUV(newpos, this.uv);
  }

  toString() {
    return this.pos.toString();
  }
}

