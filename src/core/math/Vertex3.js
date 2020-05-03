const Vector3D = require('./Vector3');
const Vector2D = require('./Vector2');
const {getTag} = require('../constants');

// # class Vertex
// Represents a vertex of a polygon. Use your own vertex class instead of this
// one to provide additional features like texture coordinates and vertex
// colors. Custom vertex classes need to provide a `pos` property
// `flipped()`, and `interpolate()` methods that behave analogous to the ones
// FIXME: And a lot MORE (see plane.fromVector3Ds for ex) ! This is fragile code
// defined by `Vertex`.
const Vertex = function (pos) {
  this.pos = pos;
  this.uv = new Vector2D(0, 0);
};

// create from an untyped object with identical property names:
Vertex.fromObject = function (obj) {
  var pos = new Vector3D(obj.pos);
  return new Vertex(pos);
};

// create with position and uv coordinates
Vertex.fromPosAndUV = function (pos, uv) {
  var newVertex = new Vertex(pos);
  newVertex.uv = uv;
  return newVertex;
};

Vertex.prototype = {
  // Return a vertex with all orientation-specific data (e.g. vertex normal) flipped. Called when the
  // orientation of a polygon is flipped.
  flipped: function () {
    return this;
  },

  getTag: function () {
    var result = this.tag;
    if (!result) {
      result = getTag();
      this.tag = result;
    }
    return result;
  },

  // Create a new vertex between this vertex and `other` by linearly
  // interpolating all properties using a parameter of `t`. Subclasses should
  // override this to interpolate additional properties.
  interpolate: function (other, t) {
    var newpos = this.pos.lerp(other.pos, t);
    var newUv = this.uv.lerp(other.uv, t);
    return Vertex.fromPosAndUV(newpos, newUv);
  },

  // Affine transformation of vertex. Returns a new Vertex
  transform: function (matrix4x4) {
    var newpos = this.pos.multiply4x4(matrix4x4);
    return Vertex.fromPosAndUV(newpos, this.uv);
  },

  toString: function () {
    return this.pos.toString();
  }
};

module.exports = Vertex;
