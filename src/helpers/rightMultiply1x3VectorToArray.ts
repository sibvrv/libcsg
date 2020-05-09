import {Matrix4x4} from '../core/math';

// Simplified, array vector rightMultiply1x3Vector
export const rightMultiply1x3VectorToArray = (matrix: Matrix4x4, vector: [number, number, number]) => {
  const [v0, v1, v2] = vector;
  const v3 = 1;
  let x = v0 * matrix.elements[0] + v1 * matrix.elements[1] + v2 * matrix.elements[2] + v3 * matrix.elements[3];
  let y = v0 * matrix.elements[4] + v1 * matrix.elements[5] + v2 * matrix.elements[6] + v3 * matrix.elements[7];
  let z = v0 * matrix.elements[8] + v1 * matrix.elements[9] + v2 * matrix.elements[10] + v3 * matrix.elements[11];
  const w = v0 * matrix.elements[12] + v1 * matrix.elements[13] + v2 * matrix.elements[14] + v3 * matrix.elements[15];

  // scale such that fourth element becomes 1:
  if (w !== 1) {
    const invw = 1.0 / w;
    x *= invw;
    y *= invw;
    z *= invw;
  }
  return [x, y, z];
};
