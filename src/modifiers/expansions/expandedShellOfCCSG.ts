import {EPS} from '../../core/constants';
import {Vertex3} from '../../core/math/Vertex3';
import {Polygon3} from '../../core/math/Polygon3';
import {fnNumberSort} from '../../core/utils';
import {CSG} from '../../core/CSG';
import {fromPolygons} from '../../core/CSGFactories';
// import {sphere} from './primitives3d'

/**
 * Create the expanded shell of the solid:
 * All faces are extruded to get a thickness of 2*radius
 * Cylinders are constructed around every side
 * Spheres are placed on every vertex
 * unionWithThis: if true, the resulting solid will be united with 'this' solid;
 * the result is a true expansion of the solid
 * If false, returns only the shell
 * @param  {Float} radius
 * @param  {Integer} resolution
 * @param  {Boolean} unionWithThis
 */
export const expandedShellOfCCSG = (_csg: CSG, radius: number, resolution: number, unionWithThis?: boolean) => {
  const csg = _csg.reTesselated();
  let result: any;
  if (unionWithThis) {
    result = csg;
  } else {
    result = new CSG();
  }

  // first extrude all polygons:
  csg.polygons.map((polygon: any) => {
    const extrudevector = polygon.plane.normal.unit().times(2 * radius);
    const translatedpolygon = polygon.translate(extrudevector.times(-0.5));
    const extrudedface = translatedpolygon.extrude(extrudevector);
    result = result.unionSub(extrudedface, false, false);
  });

  // Make a list of all unique vertex pairs (i.e. all sides of the solid)
  // For each vertex pair we collect the following:
  //   v1: first coordinate
  //   v2: second coordinate
  //   planenormals: array of normal vectors of all planes touching this side
  const vertexpairs: any = {}; // map of 'vertex pair tag' to {v1, v2, planenormals}
  csg.polygons.map((polygon: any) => {
    const numvertices = polygon.vertices.length;
    let prevvertex = polygon.vertices[numvertices - 1];
    let prevvertextag = prevvertex.getTag();
    for (let i = 0; i < numvertices; i++) {
      const vertex = polygon.vertices[i];
      const vertextag = vertex.getTag();
      let vertextagpair;
      if (vertextag < prevvertextag) {
        vertextagpair = vertextag + '-' + prevvertextag;
      } else {
        vertextagpair = prevvertextag + '-' + vertextag;
      }
      let obj;
      if (vertextagpair in vertexpairs) {
        obj = vertexpairs[vertextagpair];
      } else {
        obj = {
          v1: prevvertex,
          v2: vertex,
          planenormals: [],
        };
        vertexpairs[vertextagpair] = obj;
      }
      obj.planenormals.push(polygon.plane.normal);

      prevvertextag = vertextag;
      prevvertex = vertex;
    }
  });

  // now construct a cylinder on every side
  // The cylinder is always an approximation of a true cylinder: it will have <resolution> polygons
  // around the sides. We will make sure though that the cylinder will have an edge at every
  // face that touches this side. This ensures that we will get a smooth fill even
  // if two edges are at, say, 10 degrees and the resolution is low.
  // Note: the result is not retesselated yet but it really should be!

  // tslint:disable-next-line:forin
  for (const vertextagpair in vertexpairs) {
    const vertexpair = vertexpairs[vertextagpair];
    const startpoint = vertexpair.v1.pos;
    const endpoint = vertexpair.v2.pos;
    // our x,y and z vectors:
    const zbase = endpoint.minus(startpoint).unit();
    const xbase = vertexpair.planenormals[0].unit();
    const ybase = xbase.cross(zbase);

    // make a list of angles that the cylinder should traverse:
    let angles = [];

    // first of all equally spaced around the cylinder:
    for (let i = 0; i < resolution; i++) {
      angles.push(i * Math.PI * 2 / resolution);
    }

    // and also at every normal of all touching planes:
    for (let i = 0, iMax = vertexpair.planenormals.length; i < iMax; i++) {
      const planenormal = vertexpair.planenormals[i];
      const si = ybase.dot(planenormal);
      const co = xbase.dot(planenormal);
      let angle = Math.atan2(si, co);

      if (angle < 0) angle += Math.PI * 2;
      angles.push(angle);
      angle = Math.atan2(-si, -co);
      if (angle < 0) angle += Math.PI * 2;
      angles.push(angle);
    }

    // this will result in some duplicate angles but we will get rid of those later.
    // Sort:
    angles = angles.sort(fnNumberSort);

    // Now construct the cylinder by traversing all angles:
    const numangles = angles.length;
    let prevp1;
    let prevp2;
    const startfacevertices = [];
    const endfacevertices = [];
    const polygons = [];
    for (let i = -1; i < numangles; i++) {
      const angle = angles[(i < 0) ? (i + numangles) : i];
      const si = Math.sin(angle);
      const co = Math.cos(angle);
      const p = xbase.times(co * radius).plus(ybase.times(si * radius));
      const p1 = startpoint.plus(p);
      const p2 = endpoint.plus(p);
      let skip = false;
      if (i >= 0) {
        if (p1.distanceTo(prevp1) < EPS) {
          skip = true;
        }
      }
      if (!skip) {
        if (i >= 0) {
          startfacevertices.push(new Vertex3(p1));
          endfacevertices.push(new Vertex3(p2));
          const polygonvertices = [
            new Vertex3(prevp2),
            new Vertex3(p2),
            new Vertex3(p1),
            new Vertex3(prevp1),
          ];
          const polygon = new Polygon3(polygonvertices);
          polygons.push(polygon);
        }
        prevp1 = p1;
        prevp2 = p2;
      }
    }
    endfacevertices.reverse();
    polygons.push(new Polygon3(startfacevertices));
    polygons.push(new Polygon3(endfacevertices));
    const cylinder = fromPolygons(polygons);
    result = result.unionSub(cylinder, false, false);
  }

  // make a list of all unique vertices
  // For each vertex we also collect the list of normals of the planes touching the vertices
  const vertexmap: any = {};
  csg.polygons.map((polygon: any) => {
    polygon.vertices.map((vertex: any) => {
      const vertextag = vertex.getTag();
      let obj;
      if (vertextag in vertexmap) {
        obj = vertexmap[vertextag];
      } else {
        obj = {
          pos: vertex.pos,
          normals: [],
        };
        vertexmap[vertextag] = obj;
      }
      obj.normals.push(polygon.plane.normal);
    });
  });

  // and build spheres at each vertex
  // We will try to set the x and z axis to the normals of 2 planes
  // This will ensure that our sphere tesselation somewhat matches 2 planes

  // tslint:disable-next-line:forin
  for (const vertextag in vertexmap) {
    const vertexobj = vertexmap[vertextag];
    // use the first normal to be the x axis of our sphere:
    const xaxis = vertexobj.normals[0].unit();
    // and find a suitable z axis. We will use the normal which is most perpendicular to the x axis:
    let bestzaxis = null;
    let bestzaxisorthogonality = 0;
    for (let i = 1; i < vertexobj.normals.length; i++) {
      const normal = vertexobj.normals[i].unit();
      const cross = xaxis.cross(normal);
      const crosslength = cross.length();
      if (crosslength > 0.05) {
        if (crosslength > bestzaxisorthogonality) {
          bestzaxisorthogonality = crosslength;
          bestzaxis = normal;
        }
      }
    }
    if (!bestzaxis) {
      bestzaxis = xaxis.randomNonParallelVector();
    }
    const yaxis = xaxis.cross(bestzaxis).unit();
    const zaxis = yaxis.cross(xaxis);
    const _sphere = CSG.sphere({
      center: vertexobj.pos,
      radius,
      resolution,
      axes: [xaxis, yaxis, zaxis],
    });
    result = result.unionSub(_sphere, false, false);
  }

  return result;
};
