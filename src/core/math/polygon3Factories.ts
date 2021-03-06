const Vector3D = require('./Vector3');
const Vertex = require('./Vertex3');
const Polygon3 = require('./Polygon3');

// FIXME : redundant code with Polygon3.createFromPoints , but unuseable due to circular dependencies
/** Create a polygon from the given points.
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
export const fromPoints = (points: number[][], shared: any, plane?: any) => {
  const vertices: any[] = [];
  points.map((p) => {
    const vec = new Vector3D(p);
    const vertex = new Vertex(vec);
    vertices.push(vertex);
  });

  return plane ? new Polygon3(vertices, shared, plane) : new Polygon3(vertices, shared);
};
