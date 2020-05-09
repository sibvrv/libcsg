import {Plane, Polygon3, Vector3, Vertex3} from '@core/math';
import {CSG} from '@core/CSG';

/**
 * Construct a CSG solid from a list of `Polygon` instances.
 * @param {Polygon[]} polygons - list of polygons
 * @returns {CSG} new CSG object
 */
export const fromPolygons = (polygons: Polygon3[]) => {
  const csg = new CSG();
  csg.polygons = polygons;
  csg.isCanonicalized = false;
  csg.isRetesselated = false;
  return csg;
};

/**
 * Construct a CSG solid from a list of pre-generated slices.
 * See Polygon.prototype.solidFromSlices() for details.
 * @param {Object} options - options passed to solidFromSlices()
 * @returns {CSG} new CSG object
 */
export function fromSlices(options: any) {
  return Polygon3.createFromPoints([
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ]).solidFromSlices(options);
}

/**
 * Reconstruct a CSG solid from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CSG} new CSG object
 */
export function fromObject(obj: any) {
  const polygons = obj.polygons.map((p: any) => {
    return Polygon3.fromObject(p);
  });
  const csg = fromPolygons(polygons);
  csg.isCanonicalized = obj.isCanonicalized;
  csg.isRetesselated = obj.isRetesselated;
  return csg;
}

/**
 * Reconstruct a CSG from the output of toCompactBinary().
 * @param {CompactBinary} bin - see toCompactBinary().
 * @returns {CSG} new CSG object
 */
export function fromCompactBinary(bin: any) {
  if (bin.class !== 'CSG') throw new Error('Not a CSG');
  const planes = [];
  const planeData = bin.planeData;
  const numplanes = planeData.length / 4;
  let arrayindex = 0;
  let x;
  let y;
  let z;
  let w;
  let normal;
  let plane;
  for (let planeindex = 0; planeindex < numplanes; planeindex++) {
    x = planeData[arrayindex++];
    y = planeData[arrayindex++];
    z = planeData[arrayindex++];
    w = planeData[arrayindex++];
    normal = Vector3.Create(x, y, z);
    plane = new Plane(normal, w);
    planes.push(plane);
  }

  const vertices = [];
  const vertexData = bin.vertexData;
  const numvertices = vertexData.length / 3;
  let pos;
  let vertex;
  arrayindex = 0;
  for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
    x = vertexData[arrayindex++];
    y = vertexData[arrayindex++];
    z = vertexData[arrayindex++];
    pos = Vector3.Create(x, y, z);
    vertex = new Vertex3(pos);
    vertices.push(vertex);
  }

  const shareds = bin.shared.map((_shared: any) => {
    return Polygon3.Shared.fromObject(_shared);
  });

  const polygons = [];
  const numpolygons = bin.numPolygons;
  const numVerticesPerPolygon = bin.numVerticesPerPolygon;
  const polygonVertices = bin.polygonVertices;
  const polygonPlaneIndexes = bin.polygonPlaneIndexes;
  const polygonSharedIndexes = bin.polygonSharedIndexes;
  let numpolygonvertices;
  let polygonvertices;
  let shared;
  let polygon; // already defined plane,
  arrayindex = 0;
  for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
    numpolygonvertices = numVerticesPerPolygon[polygonindex];
    polygonvertices = [];
    for (let i = 0; i < numpolygonvertices; i++) {
      polygonvertices.push(vertices[polygonVertices[arrayindex++]]);
    }
    plane = planes[polygonPlaneIndexes[polygonindex]];
    shared = shareds[polygonSharedIndexes[polygonindex]];
    polygon = new Polygon3(polygonvertices, shared, plane);
    polygons.push(polygon);
  }
  const csg = fromPolygons(polygons);
  csg.isCanonicalized = true;
  csg.isRetesselated = true;
  return csg;
}
