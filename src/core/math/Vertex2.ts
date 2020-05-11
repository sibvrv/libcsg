import {getTag} from '@core/constants';
import {Vector2} from '.';

/**
 * Vertex2
 * @class Vertex2
 */
export class Vertex2 { // extends TransformationMethods
  tag?: number;

  /**
   * From Object
   * @param obj
   */
  static fromObject(obj: any) {
    return new Vertex2(new Vector2(obj.pos._x, obj.pos._y));
  }

  /**
   * Vertex2 constructor
   * @param pos
   */
  constructor(public pos: Vector2) {
  }

  /**
   * To String helper
   */
  toString() {
    return '(' + this.pos.x.toFixed(5) + ',' + this.pos.y.toFixed(5) + ')';
  }

  /**
   * Get Tag
   */
  getTag() {
    let result = this.tag;
    if (!result) {
      result = getTag();
      this.tag = result;
    }
    return result;
  }
}
