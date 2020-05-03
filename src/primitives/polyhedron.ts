const {CSG} = require('../csg');
const Polygon3 = require('../core/math/Polygon3');
const Vector3 = require('../core/math/Vector3');
const Vertex3 = require('../core/math/Vertex3');

/** Construct a polyhedron from the given triangles/ polygons/points
 * @param {Object} [options] - options for construction
 * @param {Array} [options.triangles] - triangles to build the polyhedron from
 * @param {Array} [options.polygons] - polygons to build the polyhedron from
 * @param {Array} [options.points] - points to build the polyhedron from
 * @param {Array} [options.colors] - colors to apply to the polyhedron
 * @returns {CSG} new polyhedron
 *
 * @example
 * let torus1 = polyhedron({
 *   points: [...]
 * })
 */
export function polyhedron(params: any) {
  const pgs = [];
  const ref = params.triangles || params.polygons;
  const colors = params.colors || null;

  for (let i = 0; i < ref.length; i++) {
    const pp = [];
    for (let j = 0; j < ref[i].length; j++) {
      pp[j] = params.points[ref[i][j]];
    }

    const v = [];
    for (let j = ref[i].length - 1; j >= 0; j--) { // --- we reverse order for examples of OpenSCAD work
      v.push(new Vertex3(new Vector3(pp[j][0], pp[j][1], pp[j][2])));
    }
    let s = Polygon3.defaultShared;
    if (colors && colors[i]) {
      s = Polygon3.Shared.fromColor(colors[i]);
    }
    pgs.push(new Polygon3(v, s));
  }

  // forced to import here, otherwise out of order imports mess things up
  const {fromPolygons} = require('../core/CSGFactories');
  return fromPolygons(pgs);
}
