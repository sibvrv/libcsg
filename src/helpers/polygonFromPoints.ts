// @ts-nocheck

import Vertex3 from '../core/math/Vertex3';
import Vector3 from '../core/math/Vector3';
import Polygon3 from '../core/math/Polygon3';

/**
 * Polygon From Points
 * @param points
 */
export const polygonFromPoints = (points: number[][]) => {
  // EEK talk about wrapping wrappers !
  const vertices = points.map(point => new Vertex3(new Vector3(point)));
  return new Polygon3(vertices);
};
