// @ts-nocheck
/* tslint:disable */


//import * as _Vertex from './math/Vertex2';
import './math/Polygon3';

/**
 * Class CAG
 * Holds a solid area geometry like CSG but 2D.
 * Each area consists of a number of sides.
 * Each side is a line between 2 points.
 * @constructor
 */
export class CAG {
  sides = [];
  isCanonicalized = false;

  // eek ! all this is kept for backwards compatibility...for now
//  static Vertex = _Vertex.default;
//  static Side = _Side.default;
}
