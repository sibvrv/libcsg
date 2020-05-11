import {Side, Vector2, Vertex2} from '@core/math';
import {areaEPS} from '@core/constants';
import {contains, isSelfIntersecting} from './utils/cagValidation';
import {difference, union} from '@modifiers/booleans';
import {CAG} from '@core/CAG';
import {CSG} from '@core/CSG';

/**
 * Construct a CAG from a list of `Side` instances.
 * @param {Side[]} sides - list of sides
 * @returns {CAG} new CAG object
 */
export const fromSides = (sides: Side[]) => {
  const cag = new CAG();
  cag.sides = sides;
  return cag;
};

/**
 * Converts a CSG to a  The CSG must consist of polygons with only z coordinates +1 and -1
 * as constructed by _toCSGWall(-1, 1). This is so we can use the 3D union(), intersect() etc
 * @param csg
 */
export const fromFakeCSG = (csg: CSG) => {
  const sides = csg.polygons
    .map((p) => Side._fromFakePolygon(p)!)
    .filter(Boolean);
  return fromSides(sides);
};

/**
 * Construct a CAG from a list of points (a polygon) or an nested array of points.
 * The rotation direction of the points is not relevant.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * Hole detection follows the even/odd rule,
 * which means that the order of the paths is not important.
 * @param {points[]|Array.<points[]>} points - (nested) list of points in 2D space
 * @returns {CAG} new CAG object
 */
export const fromPoints = (points: any): CAG => {
  if (!points) {
    throw new Error('points parameter must be defined');
  }
  if (!Array.isArray(points)) {
    throw new Error('points parameter must be an array');
  }
  if (points[0].x !== undefined || typeof points[0][0] === 'number') {
    return fromPointsArray(points);
  }
  if (typeof points[0][0] === 'object') {
    return fromNestedPointsArray(points);
  }
  throw new Error('Unsupported points list format');
};

/**
 * Do not export the two following function (code splitting for fromPoints())
 * @param points
 */
export const fromPointsArray = (points: any) => {
  if (points.length < 3) {
    throw new Error('CAG shape needs at least 3 points');
  }
  const sides: any[] = [];
  let prevvertex = new Vertex2(new Vector2(points[points.length - 1]));
  points.map((point: any) => {
    const vertex = new Vertex2(new Vector2(point));
    sides.push(new Side(prevvertex, vertex));
    prevvertex = vertex;
  });
  let result = fromSides(sides);
  if (isSelfIntersecting(result)) {
    throw new Error('Polygon is self intersecting!');
  }
  const area = result.area();
  if (Math.abs(area) < areaEPS) {
    throw new Error('Degenerate polygon!');
  }
  if (area < 0) {
    result = result.flipped();
  }
  return result.canonicalized();
};

/**
 * From Nested Points Array
 * @param points
 */
export const fromNestedPointsArray = (points: any) => {
  if (points.length === 1) {
    return fromPoints(points[0]);
  }
  // First pass: create a collection of CAG paths
  const paths: any = [];
  points.forEach((_path: any) => {
    paths.push(fromPointsArray(_path));
  });
  // Second pass: make a tree of paths
  const tree: any = {};
  // for each polygon extract parents and childs polygons
  paths.forEach((p1: any, i: any) => {
    // check for intersection
    paths.forEach((p2: any, y: any) => {
      if (p1 !== p2) {
        // create default node
        tree[i] || (tree[i] = {parents: [], isHole: false});
        tree[y] || (tree[y] = {parents: [], isHole: false});
        // check if polygon2 stay in poylgon1
        if (contains(p2, p1)) {
          // push parent and child; odd parents number ==> hole
          tree[i].parents.push(y);
          tree[i].isHole = !!(tree[i].parents.length % 2);
          tree[y].isHole = !!(tree[y].parents.length % 2);
        }
      }
    });
  });
  // Third pass: subtract holes
  let path = null;

  // tslint:disable-next-line:forin
  for (const key in tree) {
    path = tree[key];
    if (path.isHole) {
      delete tree[key]; // remove holes for final pass
      path.parents.forEach((parentKey: any) => {
        paths[parentKey] = difference(paths[parentKey], paths[key]);
      });
    }
  }
  // Fourth and last pass: create final CAG object
  let cag = fromSides([]);

  // tslint:disable-next-line:forin
  for (const key in tree) {
    cag = union(cag, paths[key]);
  }
  return cag;
};

/**
 * Reconstruct a CAG from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CAG} new CAG object
 */
export const fromObject = (obj: any) => {

  const sides = obj.sides.map((s: any) => {
    return Side.fromObject(s);
  });

  const cag = fromSides(sides);
  cag.isCanonicalized = obj.isCanonicalized;

  return cag;
};

/**
 * Construct a CAG from a list of points (a polygon).
 * Like fromPoints() but does not check if the result is a valid polygon.
 * The points MUST rotate counter clockwise.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * @param {points[]} points - list of points in 2D space
 * @returns {CAG} new CAG object
 */
export const fromPointsNoCheck = (points: any) => {
  const sides: any[] = [];
  const prevpoint = new Vector2(points[points.length - 1]);

  let prevvertex = new Vertex2(prevpoint);

  points.map((p: any) => {
    const point = new Vector2(p);
    const vertex = new Vertex2(point);
    const side = new Side(prevvertex, vertex);
    sides.push(side);
    prevvertex = vertex;
  });
  return fromSides(sides);
};

/**
 * Construct a CAG from a 2d-path (a closed sequence of points).
 * Like fromPoints() but does not check if the result is a valid polygon.
 * @param {path} Path2 - a Path2 path
 * @returns {CAG} new CAG object
 */
export const fromPath2 = (path: any) => {
  if (!path.isClosed()) throw new Error('The path should be closed!');
  return fromPoints(path.getPoints());
};

/**
 * Reconstruct a CAG from the output of toCompactBinary().
 * @param {CompactBinary} bin - see toCompactBinary()
 * @returns {CAG} new CAG object
 */
export const fromCompactBinary = (bin: any) => {
  if (bin.class !== 'CAG') throw new Error('Not a CAG');
  const vertices = [];
  const vertexData = bin.vertexData;
  const numvertices = vertexData.length / 2;
  let arrayindex = 0;
  for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
    const x = vertexData[arrayindex++];
    const y = vertexData[arrayindex++];
    const pos = new Vector2(x, y);
    const vertex = new Vertex2(pos);
    vertices.push(vertex);
  }
  const sides = [];
  const numsides = bin.sideVertexIndices.length / 2;
  arrayindex = 0;
  for (let sideindex = 0; sideindex < numsides; sideindex++) {
    const vertexindex0 = bin.sideVertexIndices[arrayindex++];
    const vertexindex1 = bin.sideVertexIndices[arrayindex++];
    const side = new Side(vertices[vertexindex0], vertices[vertexindex1]);
    sides.push(side);
  }
  const cag = fromSides(sides);
  cag.isCanonicalized = true;
  return cag;
};
