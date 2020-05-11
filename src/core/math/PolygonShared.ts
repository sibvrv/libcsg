import {getTag} from '@core/constants';

/**
 * Class Polygon.Shared
 * Holds the shared properties for each polygon (Currently only color).
 * @constructor
 * @param {Array[]} color - array containing RGBA values, or null
 *
 * @example
 *   let shared = new CSG.Polygon.Shared([0, 0, 0, 1])
 */
export class PolygonShared {
  color: [number, number, number, number];
  tag?: number;

  /**
   * make from object
   * @param obj
   */
  static fromObject(obj: any) {
    return new PolygonShared(obj.color);
  };

  /**
   * Create Polygon.Shared from color values.
   * @param {number} r - value of RED component
   * @param {number} g - value of GREEN component
   * @param {number} b - value of BLUE component
   * @param {number} [a] - value of ALPHA component
   * @param {Array[]} [color] - OR array containing RGB values (optional Alpha)
   *
   * @example
   * let s1 = Polygon.Shared.fromColor(0,0,0)
   * let s2 = Polygon.Shared.fromColor([0,0,0,1])
   */
  static fromColor(...args: any[]) {
    let color;
    if (args.length === 1) {
      color = args[0].slice(); // make deep copy
    } else {
      color = [];

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < args.length; i++) {
        color.push(args[i]);
      }
    }
    if (color.length === 3) {
      color.push(1);
    } else if (color.length !== 4) {
      throw new Error('setColor expects either an array with 3 or 4 elements, or 3 or 4 parameters.');
    }
    return new PolygonShared(color);
  };

  /**
   * PolygonShared Constructor
   */
  constructor(color?: [number, number, number, number] | null) {
    if (typeof color !== 'undefined' && color !== null) {
      if (color.length !== 4) {
        throw new Error('Expecting 4 element array');
      }
    }
    this.color = color as any;
  }

  /**
   * get Tag
   */
  getTag() {
    let result = this.tag;
    if (!result) {
      result = getTag();
      this.tag = result;
    }
    return result;
  }

  /**
   * get a string uniquely identifying this object
   */
  getHash() {
    if (!this.color) return 'null';
    return this.color.join('/');
  }
}
