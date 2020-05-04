const Vertex3 = require('../core/math/Vertex3');
const Vector3 = require('../core/math/Vector3');
const Polygon3 = require('../core/math/Polygon3');

/**
 * Polygon From Points
 * @param points
 */
export const polygonFromPoints = (points: number[][]) => {
  // EEK talk about wrapping wrappers !
  const vertices = points.map(point => new Vertex3(new Vector3(point)));
  return new Polygon3(vertices);
};
