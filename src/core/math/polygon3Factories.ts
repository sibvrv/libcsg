import {Plane, Polygon3, PolygonShared, Vector3, Vertex3} from '.';

// FIXME : redundant code with Polygon3.createFromPoints , but unuseable due to circular dependencies
/**
 * Create a polygon from the given points.
 *
 * @param {Array[]} points - list of points
 * @param {Polygon.Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 *
 * @example
 * const points = [
 *   [0,  0, 0],
 *   [0, 10, 0],
 *   [0, 10, 10]
 * ]
 * let polygon = CSG.Polygon.createFromPoints(points)
 */
export const fromPoints = (points: number[][], shared: PolygonShared, plane?: Plane) => {
  const vertices: any[] = [];
  points.map((p) => {
    const vec = new Vector3(p);
    const vertex = new Vertex3(vec);
    vertices.push(vertex);
  });

  return plane ? new Polygon3(vertices, shared, plane) : new Polygon3(vertices, shared);
};
