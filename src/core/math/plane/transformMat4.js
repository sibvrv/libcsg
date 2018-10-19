const mat4 = require('../mat4')
const vec3 = require('../vec3')

const fromVec3s = require('./fromVec3s')
const flip = require('./flip')

/**
 * Transform the given plane using the given matrix
 * @return {Array} a new plane with properly typed values
 */
const transformMat4 = (matrix, plane) => {
  const ismirror = mat4.isMirroring(matrix)
  // get two vectors in the plane:
  const r = vec3.random(plane)
  const u = vec3.cross(plane, r)
  const v = vec3.cross(plane, u)
  // get 3 points in the plane:
  let point1 = vec3.multiply(plane, [plane[3], plane[3], plane[3]])
  let point2 = vec3.add(point1, u)
  let point3 = vec3.add(point1, v)
  // transform the points:
  point1 = vec3.transformMat4(matrix, point1)
  point2 = vec3.transformMat4(matrix, point2)
  point3 = vec3.transformMat4(matrix, point3)
  // and create a new plane from the transformed points:
  let newplane = fromVec3s(point1, point2, point3)
  if (ismirror) {
    // the transform is mirroring so mirror the plane
    newplane = flip(newplane)
  }
  return newplane
}

module.exports = transformMat4