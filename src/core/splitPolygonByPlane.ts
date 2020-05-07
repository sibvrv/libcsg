import {Plane} from './math/Plane';
import {Polygon3} from './math/Polygon3';
import {EPS} from './constants';
import {calcInterpolationFactor} from './math/calcInterpolationFactor';

// Returns object:
// .type:
//   0: coplanar-front
//   1: coplanar-back
//   2: front
//   3: back
//   4: spanning
// In case the polygon is spanning, returns:
// .front: a Polygon of the front part
// .back: a Polygon of the back part
export function splitPolygonByPlane(plane: Plane, polygon: Polygon3) {
  const result: {
    type: number | null,
    front: Polygon3 | null,
    back: Polygon3 | null
  } = {
    type: null,
    front: null,
    back: null,
  };
  // cache in local lets (speedup):
  const planenormal = plane.normal;
  const vertices = polygon.vertices;
  const numvertices = vertices.length;
  if (polygon.plane.equals(plane)) {
    result.type = 0;
  } else {
    const thisw = plane.w;
    let hasfront = false;
    let hasback = false;
    const vertexIsBack = [];
    const MINEPS = -EPS;
    for (let i = 0; i < numvertices; i++) {
      const t = planenormal.dot(vertices[i].pos) - thisw;
      const isback = (t < 0);
      vertexIsBack.push(isback);
      if (t > EPS) hasfront = true;
      if (t < MINEPS) hasback = true;
    }
    if ((!hasfront) && (!hasback)) {
      // all points coplanar
      const t = planenormal.dot(polygon.plane.normal);
      result.type = (t >= 0) ? 0 : 1;
    } else if (!hasback) {
      result.type = 2;
    } else if (!hasfront) {
      result.type = 3;
    } else {
      // spanning
      result.type = 4;
      const frontvertices = [];
      const backvertices = [];
      let isback = vertexIsBack[0];
      for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
        const vertex = vertices[vertexindex];
        let nextvertexindex = vertexindex + 1;
        if (nextvertexindex >= numvertices) nextvertexindex = 0;
        const nextisback = vertexIsBack[nextvertexindex];
        if (isback === nextisback) {
          // line segment is on one side of the plane:
          if (isback) {
            backvertices.push(vertex);
          } else {
            frontvertices.push(vertex);
          }
        } else {
          // line segment intersects plane:
          const point = vertex.pos;
          const nextpoint = vertices[nextvertexindex].pos;
          const interpolationFactor =
            calcInterpolationFactor(point, nextpoint, plane.splitLineBetweenPoints(point, nextpoint));
          const intersectionvertex = vertex.interpolate(vertices[nextvertexindex], interpolationFactor);
          if (isback) {
            backvertices.push(vertex);
            backvertices.push(intersectionvertex);
            frontvertices.push(intersectionvertex);
          } else {
            frontvertices.push(vertex);
            frontvertices.push(intersectionvertex);
            backvertices.push(intersectionvertex);
          }
        }
        isback = nextisback;
      } // for vertexindex
      // remove duplicate vertices:
      const EPS_SQUARED = EPS * EPS;
      if (backvertices.length >= 3) {
        let prevvertex = backvertices[backvertices.length - 1];
        for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {
          const vertex = backvertices[vertexindex];
          if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
            backvertices.splice(vertexindex, 1);
            vertexindex--;
          }
          prevvertex = vertex;
        }
      }
      if (frontvertices.length >= 3) {
        let prevvertex = frontvertices[frontvertices.length - 1];
        for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {
          const vertex = frontvertices[vertexindex];
          if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
            frontvertices.splice(vertexindex, 1);
            vertexindex--;
          }
          prevvertex = vertex;
        }
      }
      if (frontvertices.length >= 3) {
        result.front = new Polygon3(frontvertices, polygon.shared, polygon.plane);
      }
      if (backvertices.length >= 3) {
        result.back = new Polygon3(backvertices, polygon.shared, polygon.plane);
      }
    }
  }
  return result;
}
