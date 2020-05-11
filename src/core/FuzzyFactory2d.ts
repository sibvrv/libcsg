import {FuzzyFactory} from '@core/FuzzyFactory';
import {EPS} from '@core/constants';
import {Side, Vertex2} from '@core/math';

/**
 * Class FuzzyCAGFactory
 */
export class FuzzyCAGFactory {
  vertexfactory = new FuzzyFactory(2, EPS);

  /**
   * Get Vertex
   * @param sourcevertex
   */
  getVertex(sourcevertex: Vertex2) {
    const elements = [sourcevertex.pos._x, sourcevertex.pos._y];
    const result = this.vertexfactory.lookupOrCreate(elements, (els) => {
      return sourcevertex;
    });
    return result;
  }

  /**
   * Get Side
   * @param sourceside
   */
  getSide(sourceside: Side) {
    const vertex0 = this.getVertex(sourceside.vertex0);
    const vertex1 = this.getVertex(sourceside.vertex1);
    return new Side(vertex0, vertex1);
  }

}
