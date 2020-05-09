import {getTag} from '../constants';
import {Matrix4x4, TransformationMethods, TVector3Universal, Vector2, Vector3} from '.';

// # class Vertex
// Represents a vertex of a polygon. Use your own vertex class instead of this
// one to provide additional features like texture coordinates and vertex
// colors. Custom vertex classes need to provide a `pos` property
// `flipped()`, and `interpolate()` methods that behave analogous to the ones
// FIXME: And a lot MORE (see plane.fromVector3Ds for ex) ! This is fragile code
// defined by `Vertex`.
export class Vertex3 extends TransformationMethods {
  uv = new Vector2(0, 0);
  tag?: number;

// create from an untyped object with identical property names:
  static fromObject(obj: { pos: TVector3Universal }) {
    const pos = new Vector3(obj.pos);
    return new Vertex3(pos);
  }

// create with position and uv coordinates
  static fromPosAndUV(pos: Vector3, uv: Vector2) {
    const newVertex = new Vertex3(pos);
    newVertex.uv = uv;
    return newVertex;
  };

  constructor(public pos: Vector3) {
    super();
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
  interpolate(other: Vertex3, t: number) {
    const newpos = this.pos.lerp(other.pos, t);
    const newUv = this.uv.lerp(other.uv, t);
    return Vertex3.fromPosAndUV(newpos, newUv);
  }

  // Affine transformation of vertex. Returns a new Vertex
  transform(matrix4x4: Matrix4x4): Vertex3 {
    const newpos = this.pos.multiply4x4(matrix4x4);
    return Vertex3.fromPosAndUV(newpos, this.uv);
  }

  toString() {
    return this.pos.toString();
  }
}

