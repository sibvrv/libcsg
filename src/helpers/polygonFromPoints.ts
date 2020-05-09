import {Polygon3, TVector3Universal, Vector3, Vertex3} from '../core/math';

/**
 * Polygon From Points
 * @param points
 */
export const polygonFromPoints = (points: TVector3Universal[]) => {
  // EEK talk about wrapping wrappers !
  const vertices = points.map((point) => new Vertex3(new Vector3(point)));
  return new Polygon3(vertices);
};
