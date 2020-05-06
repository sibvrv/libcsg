import {parseOption, parseOptionAs2DVector, parseOptionAs3DVector, parseOptionAs3DVectorList, parseOptionAsFloat, parseOptionAsInt} from '../../api/optionParsers';
import {defaultResolution2D, defaultResolution3D, EPS} from '../../core/constants';
import {fromPolygons} from '../../core/CSGFactories';

import {Vector3} from '../../core/math/Vector3';
import {Vertex3} from '../../core/math/Vertex3';
import {Polygon as Polygon3} from '../../core/math/Polygon3';
import {Connector} from '../../core/Connector';
import {Properties} from '../../core/Properties';

/** Construct an axis-aligned solid cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3} [options.center=[0,0,0]] - center of cube
 * @param {Vector3} [options.radius=[1,1,1]] - radius of cube, single scalar also possible
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cube = CSG.cube({
 *   center: [5, 5, 5],
 *   radius: 5, // scalar radius
 * });
 */
export const cube = (options: any) => {
  let c: any;
  let r: any;
  let corner1;
  let corner2;
  options = options || {};
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('cube: should either give a radius and center parameter, or a corner1 and corner2 parameter');
    }
    corner1 = parseOptionAs3DVector(options, 'corner1', [0, 0, 0]);
    corner2 = parseOptionAs3DVector(options, 'corner2', [1, 1, 1]);
    c = corner1.plus(corner2).times(0.5);
    r = corner2.minus(corner1).times(0.5);
  } else {
    c = parseOptionAs3DVector(options, 'center', [0, 0, 0]);
    r = parseOptionAs3DVector(options, 'radius', [1, 1, 1]);
  }
  r = r.abs(); // negative radii make no sense
  const result = fromPolygons([
    [
      [0, 4, 6, 2],
      [-1, 0, 0],
    ],
    [
      [1, 3, 7, 5],
      [+1, 0, 0],
    ],
    [
      [0, 1, 5, 4],
      [0, -1, 0],
    ],
    [
      [2, 6, 7, 3],
      [0, +1, 0],
    ],
    [
      [0, 2, 3, 1],
      [0, 0, -1],
    ],
    [
      [4, 5, 7, 6],
      [0, 0, +1],
    ],
  ].map((info) => {
    const vertices = info[0].map((i) => {
      const pos = new Vector3(
        c.x + r.x * (2 * +!!(i & 1) - 1), c.y + r.y * (2 * +!!(i & 2) - 1), c.z + r.z * (2 * +!!(i & 4) - 1));
      return new Vertex3(pos);
    });
    return new Polygon3(vertices, null /* , plane */);
  }));

  result.properties.cube = new Properties();
  result.properties.cube.center = new Vector3(c);
  // add 6 connectors, at the centers of each face:
  result.properties.cube.facecenters = [
    new Connector(new Vector3([r.x, 0, 0]).plus(c), [1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3([-r.x, 0, 0]).plus(c), [-1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3([0, r.y, 0]).plus(c), [0, 1, 0], [0, 0, 1]),
    new Connector(new Vector3([0, -r.y, 0]).plus(c), [0, -1, 0], [0, 0, 1]),
    new Connector(new Vector3([0, 0, r.z]).plus(c), [0, 0, 1], [1, 0, 0]),
    new Connector(new Vector3([0, 0, -r.z]).plus(c), [0, 0, -1], [1, 0, 0]),
  ];
  return result;
};

/** Construct a solid sphere
 * @param {Object} [options] - options for construction
 * @param {Vector3} [options.center=[0,0,0]] - center of sphere
 * @param {Number} [options.radius=1] - radius of sphere
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @param {Array} [options.axes] -  an array with 3 vectors for the x, y and z base vectors
 * @returns {CSG} new 3D solid
 *
 *
 * @example
 * let sphere = CSG.sphere({
 *   center: [0, 0, 0],
 *   radius: 2,
 *   resolution: 32,
 * });
 */
export const sphere = (options: any) => {
  options = options || {};
  const center = parseOptionAs3DVector(options, 'center', [0, 0, 0]);
  const radius = parseOptionAsFloat(options, 'radius', 1);
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D);
  let xvector;
  let yvector;
  let zvector;
  if ('axes' in options) {
    xvector = options.axes[0].unit().times(radius);
    yvector = options.axes[1].unit().times(radius);
    zvector = options.axes[2].unit().times(radius);
  } else {
    xvector = new Vector3([1, 0, 0]).times(radius);
    yvector = new Vector3([0, -1, 0]).times(radius);
    zvector = new Vector3([0, 0, 1]).times(radius);
  }
  if (resolution < 4) resolution = 4;
  const qresolution = Math.round(resolution / 4);
  let prevcylinderpoint;
  const polygons = [];
  for (let slice1 = 0; slice1 <= resolution; slice1++) {
    const angle = Math.PI * 2.0 * slice1 / resolution;
    const cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)));
    if (slice1 > 0) {
      // cylinder vertices:
      let vertices = [];
      let prevcospitch;
      let prevsinpitch;
      for (let slice2 = 0; slice2 <= qresolution; slice2++) {
        const pitch = 0.5 * Math.PI * slice2 / qresolution;
        const cospitch = Math.cos(pitch);
        const sinpitch = Math.sin(pitch);
        if (slice2 > 0) {
          vertices = [];
          vertices.push(new Vertex3(center.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
          vertices.push(new Vertex3(center.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
          if (slice2 < qresolution) {
            vertices.push(new Vertex3(center.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
          }
          vertices.push(new Vertex3(center.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
          polygons.push(new Polygon3(vertices));
          vertices = [];
          vertices.push(new Vertex3(center.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
          vertices.push(new Vertex3(center.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
          if (slice2 < qresolution) {
            vertices.push(new Vertex3(center.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
          }
          vertices.push(new Vertex3(center.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
          vertices.reverse();
          polygons.push(new Polygon3(vertices));
        }
        prevcospitch = cospitch;
        prevsinpitch = sinpitch;
      }
    }
    prevcylinderpoint = cylinderpoint;
  }
  const result = fromPolygons(polygons);
  result.properties.sphere = new Properties();
  result.properties.sphere.center = new Vector3(center);
  result.properties.sphere.facepoint = center.plus(xvector);
  return result;
};

/** Construct a solid cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of cylinder, must be scalar
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cylinder = CSG.cylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 10,
 *   resolution: 16
 * });
 */
export const cylinder = (options: any) => {
  const s = parseOptionAs3DVector(options, 'start', [0, -1, 0]);
  const e = parseOptionAs3DVector(options, 'end', [0, 1, 0]);
  const r = parseOptionAsFloat(options, 'radius', 1);
  const rEnd = parseOptionAsFloat(options, 'radiusEnd', r);
  const rStart = parseOptionAsFloat(options, 'radiusStart', r);
  let alpha = parseOptionAsFloat(options, 'sectorAngle', 360);
  alpha = alpha > 360 ? alpha % 360 : alpha;

  if ((rEnd < 0) || (rStart < 0)) {
    throw new Error('Radius should be non-negative');
  }
  if ((rEnd === 0) && (rStart === 0)) {
    throw new Error('Either radiusStart or radiusEnd should be positive');
  }

  const slices = parseOptionAsInt(options, 'resolution', defaultResolution2D); // FIXME is this 3D?
  const ray = e.minus(s);
  const axisZ = ray.unit(); // , isY = (Math.abs(axisZ.y) > 0.5);
  const axisX = axisZ.randomNonParallelVector().unit();

  //  let axisX = new Vector3(isY, !isY, 0).cross(axisZ).unit();
  const axisY = axisX.cross(axisZ).unit();
  const start = new Vertex3(s);
  const end = new Vertex3(e);
  const polygons = [];

  function point(stack: number, slice: number, radius: number) {
    const angle = slice * Math.PI * alpha / 180;
    const out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)));
    const pos = s.plus(ray.times(stack)).plus(out.times(radius));
    return new Vertex3(pos);
  }

  if (alpha > 0) {
    for (let i = 0; i < slices; i++) {
      const t0 = i / slices;
      const t1 = (i + 1) / slices;
      if (rEnd === rStart) {
        polygons.push(new Polygon3([start, point(0, t0, rEnd), point(0, t1, rEnd)]));
        polygons.push(new Polygon3([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]));
        polygons.push(new Polygon3([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
      } else {
        if (rStart > 0) {
          polygons.push(new Polygon3([start, point(0, t0, rStart), point(0, t1, rStart)]));
          polygons.push(new Polygon3([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]));
        }
        if (rEnd > 0) {
          polygons.push(new Polygon3([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
          polygons.push(new Polygon3([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]));
        }
      }
    }
    if (alpha < 360) {
      polygons.push(new Polygon3([start, end, point(0, 0, rStart)]));
      polygons.push(new Polygon3([point(0, 0, rStart), end, point(1, 0, rEnd)]));
      polygons.push(new Polygon3([start, point(0, 1, rStart), end]));
      polygons.push(new Polygon3([point(0, 1, rStart), point(1, 1, rEnd), end]));
    }
  }
  const result = fromPolygons(polygons);
  result.properties.cylinder = new Properties();
  result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX);
  result.properties.cylinder.end = new Connector(e, axisZ, axisX);
  const cylCenter = s.plus(ray.times(0.5));
  const fptVec = axisX.rotate(s, axisZ, -alpha / 2).times((rStart + rEnd) / 2);
  const fptVec90 = fptVec.cross(axisZ);
  // note this one is NOT a face normal for a cone. - It's horizontal from cyl perspective
  result.properties.cylinder.facepointH = new Connector(cylCenter.plus(fptVec), fptVec, axisZ);
  result.properties.cylinder.facepointH90 = new Connector(cylCenter.plus(fptVec90), fptVec90, axisZ);
  return result;
};

/** Construct a cylinder with rounded ends.
 * @param {Object} [options] - options for construction
 * @param {Vector3} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector3} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of rounded ends, must be scalar
 * @param {Vector3} [options.normal] - vector determining the starting angle for tesselation. Should be non-parallel to start.minus(end)
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cylinder = CSG.roundedCylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 2,
 *   resolution: 16
 * });
 */
export const roundedCylinder = (options: any) => {
  const p1 = parseOptionAs3DVector(options, 'start', [0, -1, 0]);
  const p2 = parseOptionAs3DVector(options, 'end', [0, 1, 0]);
  const radius = parseOptionAsFloat(options, 'radius', 1);
  const direction = p2.minus(p1);
  let defaultnormal;
  if (Math.abs(direction.x) > Math.abs(direction.y)) {
    defaultnormal = new Vector3(0, 1, 0);
  } else {
    defaultnormal = new Vector3(1, 0, 0);
  }
  const normal = parseOptionAs3DVector(options, 'normal', defaultnormal);
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D);
  if (resolution < 4) resolution = 4;
  const polygons = [];
  const qresolution = Math.floor(0.25 * resolution);
  const length = direction.length();
  if (length < EPS) {
    return sphere({
      center: p1,
      radius,
      resolution,
    });
  }
  const zvector = direction.unit().times(radius);
  const xvector = zvector.cross(normal).unit().times(radius);
  const yvector = xvector.cross(zvector).unit().times(radius);
  let prevcylinderpoint;
  for (let slice1 = 0; slice1 <= resolution; slice1++) {
    const angle = Math.PI * 2.0 * slice1 / resolution;
    const cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)));
    if (slice1 > 0) {
      // cylinder vertices:
      let vertices = [];
      vertices.push(new Vertex3(p1.plus(cylinderpoint)));
      vertices.push(new Vertex3(p1.plus(prevcylinderpoint)));
      vertices.push(new Vertex3(p2.plus(prevcylinderpoint)));
      vertices.push(new Vertex3(p2.plus(cylinderpoint)));
      polygons.push(new Polygon3(vertices));
      let prevcospitch;
      let prevsinpitch;
      for (let slice2 = 0; slice2 <= qresolution; slice2++) {
        const pitch = 0.5 * Math.PI * slice2 / qresolution;
        // let pitch = Math.asin(slice2/qresolution);
        const cospitch = Math.cos(pitch);
        const sinpitch = Math.sin(pitch);
        if (slice2 > 0) {
          vertices = [];
          vertices.push(new Vertex3(p1.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
          vertices.push(new Vertex3(p1.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
          if (slice2 < qresolution) {
            vertices.push(new Vertex3(p1.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
          }
          vertices.push(new Vertex3(p1.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
          polygons.push(new Polygon3(vertices));
          vertices = [];
          vertices.push(new Vertex3(p2.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
          vertices.push(new Vertex3(p2.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
          if (slice2 < qresolution) {
            vertices.push(new Vertex3(p2.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
          }
          vertices.push(new Vertex3(p2.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
          vertices.reverse();
          polygons.push(new Polygon3(vertices));
        }
        prevcospitch = cospitch;
        prevsinpitch = sinpitch;
      }
    }
    prevcylinderpoint = cylinderpoint;
  }
  const result = fromPolygons(polygons);
  const ray = zvector.unit();
  const axisX = xvector.unit();
  result.properties.roundedCylinder = new Properties();
  result.properties.roundedCylinder.start = new Connector(p1, ray.negated(), axisX);
  result.properties.roundedCylinder.end = new Connector(p2, ray, axisX);
  result.properties.roundedCylinder.facepoint = p1.plus(xvector);
  return result;
};

/** Construct an elliptic cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector3} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector3} [options.end=[0,1,0]] - end point of cylinder
 * @param {Vector2D} [options.radius=[1,1]] - radius of rounded ends, must be two dimensional array
 * @param {Vector2D} [options.radiusStart=[1,1]] - OPTIONAL radius of rounded start, must be two dimensional array
 * @param {Vector2D} [options.radiusEnd=[1,1]] - OPTIONAL radius of rounded end, must be two dimensional array
 * @param {Number} [options.resolution=defaultResolution2D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 *     let cylinder = CSG.cylinderElliptic({
 *       start: [0, -10, 0],
 *       end: [0, 10, 0],
 *       radiusStart: [10,5],
 *       radiusEnd: [8,3],
 *       resolution: 16
 *     });
 */

export const cylinderElliptic = (options: any) => {
  const s = parseOptionAs3DVector(options, 'start', [0, -1, 0]);
  const e = parseOptionAs3DVector(options, 'end', [0, 1, 0]);
  const r = parseOptionAs2DVector(options, 'radius', [1, 1]);
  const rEnd = parseOptionAs2DVector(options, 'radiusEnd', r);
  const rStart = parseOptionAs2DVector(options, 'radiusStart', r);

  if ((rEnd._x < 0) || (rStart._x < 0) || (rEnd._y < 0) || (rStart._y < 0)) {
    throw new Error('Radius should be non-negative');
  }
  if ((rEnd._x === 0 || rEnd._y === 0) && (rStart._x === 0 || rStart._y === 0)) {
    throw new Error('Either radiusStart or radiusEnd should be positive');
  }

  const slices = parseOptionAsInt(options, 'resolution', defaultResolution2D); // FIXME is this correct?
  const ray = e.minus(s);
  const axisZ = ray.unit(); // , isY = (Math.abs(axisZ.y) > 0.5);
  const axisX = axisZ.randomNonParallelVector().unit();

  //  let axisX = new Vector3(isY, !isY, 0).cross(axisZ).unit();
  const axisY = axisX.cross(axisZ).unit();
  const start = new Vertex3(s);
  const end = new Vertex3(e);
  const polygons = [];

  function point(stack: number, slice: number, radius: any) {
    const angle = slice * Math.PI * 2;
    const out = axisX.times(radius._x * Math.cos(angle)).plus(axisY.times(radius._y * Math.sin(angle)));
    const pos = s.plus(ray.times(stack)).plus(out);
    return new Vertex3(pos);
  }

  for (let i = 0; i < slices; i++) {
    const t0 = i / slices;
    const t1 = (i + 1) / slices;

    if (rEnd._x === rStart._x && rEnd._y === rStart._y) {
      polygons.push(new Polygon3([start, point(0, t0, rEnd), point(0, t1, rEnd)]));
      polygons.push(new Polygon3([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]));
      polygons.push(new Polygon3([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
    } else {
      if (rStart._x > 0) {
        polygons.push(new Polygon3([start, point(0, t0, rStart), point(0, t1, rStart)]));
        polygons.push(new Polygon3([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]));
      }
      if (rEnd._x > 0) {
        polygons.push(new Polygon3([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
        polygons.push(new Polygon3([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]));
      }
    }
  }
  const result = fromPolygons(polygons);
  result.properties.cylinder = new Properties();
  result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX);
  result.properties.cylinder.end = new Connector(e, axisZ, axisX);
  result.properties.cylinder.facepoint = s.plus(axisX.times(rStart));
  return result;
};

/** Construct an axis-aligned solid rounded cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3} [options.center=[0,0,0]] - center of rounded cube
 * @param {Vector3} [options.radius=[1,1,1]] - radius of rounded cube, single scalar is possible
 * @param {Number} [options.roundradius=0.2] - radius of rounded edges
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cube = CSG.roundedCube({
 *   center: [2, 0, 2],
 *   radius: 15,
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
export const roundedCube = (options: any) => {
  const minRR = 1e-2; // minroundradius 1e-3 gives rounding errors already
  let center;
  let cuberadius;
  let corner1;
  let corner2;
  options = options || {};
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('roundedCube: should either give a radius and center parameter, or a corner1 and corner2 parameter');
    }
    corner1 = parseOptionAs3DVector(options, 'corner1', [0, 0, 0]);
    corner2 = parseOptionAs3DVector(options, 'corner2', [1, 1, 1]);
    center = corner1.plus(corner2).times(0.5);
    cuberadius = corner2.minus(corner1).times(0.5);
  } else {
    center = parseOptionAs3DVector(options, 'center', [0, 0, 0]);
    cuberadius = parseOptionAs3DVector(options, 'radius', [1, 1, 1]);
  }
  cuberadius = cuberadius.abs(); // negative radii make no sense
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D);
  if (resolution < 4) resolution = 4;
  if (resolution % 2 === 1 && resolution < 8) resolution = 8; // avoid ugly
  let roundradius = parseOptionAs3DVector(options, 'roundradius', [0.2, 0.2, 0.2]);
  // slight hack for now - total radius stays ok
  roundradius = Vector3.Create(Math.max(roundradius.x, minRR), Math.max(roundradius.y, minRR), Math.max(roundradius.z, minRR));
  const innerradius = cuberadius.minus(roundradius);
  if (innerradius.x < 0 || innerradius.y < 0 || innerradius.z < 0) {
    throw new Error('roundradius <= radius!');
  }
  let res = sphere({radius: 1, resolution});
  res = res.scale(roundradius);
  innerradius.x > EPS && (res = res.stretchAtPlane([1, 0, 0], [0, 0, 0], 2 * innerradius.x));
  innerradius.y > EPS && (res = res.stretchAtPlane([0, 1, 0], [0, 0, 0], 2 * innerradius.y));
  innerradius.z > EPS && (res = res.stretchAtPlane([0, 0, 1], [0, 0, 0], 2 * innerradius.z));
  res = res.translate([-innerradius.x + center.x, -innerradius.y + center.y, -innerradius.z + center.z]);
  res = res.reTesselated();
  res.properties.roundedCube = new Properties();
  res.properties.roundedCube.center = new Vertex3(center);
  res.properties.roundedCube.facecenters = [
    new Connector(new Vector3([cuberadius.x, 0, 0]).plus(center), [1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3([-cuberadius.x, 0, 0]).plus(center), [-1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3([0, cuberadius.y, 0]).plus(center), [0, 1, 0], [0, 0, 1]),
    new Connector(new Vector3([0, -cuberadius.y, 0]).plus(center), [0, -1, 0], [0, 0, 1]),
    new Connector(new Vector3([0, 0, cuberadius.z]).plus(center), [0, 0, 1], [1, 0, 0]),
    new Connector(new Vector3([0, 0, -cuberadius.z]).plus(center), [0, 0, -1], [1, 0, 0]),
  ];
  return res;
};

/** Create a polyhedron using Openscad style arguments.
 * Define face vertices clockwise looking from outside.
 * @param {Object} [options] - options for construction
 * @returns {CSG} new 3D solid
 */
export const polyhedron = (options: any) => {
  options = options || {};
  if (('points' in options) !== ('faces' in options)) {
    throw new Error('polyhedron needs \'points\' and \'faces\' arrays');
  }
  const vertices = parseOptionAs3DVectorList(options, 'points', [
    [1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [-1, 1, 0],
    [0, 0, 1],
  ])
    .map((pt: any) => {
      return new Vertex3(pt);
    });
  const faces = parseOption(options, 'faces', [
    [0, 1, 4],
    [1, 2, 4],
    [2, 3, 4],
    [3, 0, 4],
    [1, 0, 3],
    [2, 1, 3],
  ]);
  // Openscad convention defines inward normals - so we have to invert here
  faces.forEach((face: any) => {
    face.reverse();
  });
  const polygons = faces.map((face: any) => {
    return new Polygon3(face.map((idx: any) => {
      return vertices[idx];
    }));
  });

  // TODO: facecenters as connectors? probably overkill. Maybe centroid
  // the re-tesselation here happens because it's so easy for a user to
  // create parametrized polyhedrons that end up with 1-2 dimensional polygons.
  // These will create infinite loops at CSG.Tree()
  return fromPolygons(polygons).reTesselated();
};
