import {EPS} from '@core/constants';
import {Plane, Polygon3, PolygonShared, Vertex3} from '@core/math';
import {FuzzyFactory} from '@core/FuzzyFactory';

// ////////////////////////////////////
export class FuzzyCSGFactory {
  vertexfactory = new FuzzyFactory(5, EPS);
  planefactory = new FuzzyFactory(4, EPS);
  polygonsharedfactory: { [hash: string]: PolygonShared } = {};

  getPolygonShared(sourceshared: PolygonShared) {
    const hash = sourceshared.getHash();
    if (hash in this.polygonsharedfactory) {
      return this.polygonsharedfactory[hash];
    } else {
      this.polygonsharedfactory[hash] = sourceshared;
      return sourceshared;
    }
  }

  getVertex(sourcevertex: Vertex3) {
    const elements = [
      sourcevertex.pos._x, sourcevertex.pos._y, sourcevertex.pos._z,
      sourcevertex.uv._x, sourcevertex.uv._y,
    ];
    const result = this.vertexfactory.lookupOrCreate(elements, (els) => {
      return sourcevertex;
    });
    return result;
  }

  getPlane(sourceplane: Plane) {
    const elements = [
      sourceplane.normal._x, sourceplane.normal._y, sourceplane.normal._z,
      sourceplane.w,
    ];
    const result = this.planefactory.lookupOrCreate(elements, (els) => {
      return sourceplane;
    });
    return result;
  }

  getPolygon(sourcepolygon: Polygon3) {
    const newplane = this.getPlane(sourcepolygon.plane);
    const newshared = this.getPolygonShared(sourcepolygon.shared);
    const _this = this;
    const newvertices = sourcepolygon.vertices.map((vertex) => {
      return _this.getVertex(vertex);
    });
    // two vertices that were originally very close may now have become
    // truly identical (referring to the same Vertex object).
    // Remove duplicate vertices:
    let newverticesDedup: Vertex3[] = [];
    if (newvertices.length > 0) {
      let prevvertextag = newvertices[newvertices.length - 1].getTag();
      newvertices.forEach((vertex) => {
        const vertextag = vertex.getTag();
        if (vertextag !== prevvertextag) {
          newverticesDedup.push(vertex);
        }
        prevvertextag = vertextag;
      });
    }
    // If it's degenerate, remove all vertices:
    if (newverticesDedup.length < 3) {
      newverticesDedup = [];
    }
    return new Polygon3(newverticesDedup, newshared, newplane);
  }
}

