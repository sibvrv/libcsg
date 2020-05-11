/**
 * Convex Hull Point
 * @class ConvexHullPoint
 */
export class ConvexHullPoint {
  /**
   * ConvexHullPoint Constructor
   * @param index
   * @param angle
   * @param distance
   */
  constructor(public index: number, public angle: number, public distance: number) {
  }

  /**
   * Compare ConvexHullPoints
   * @param p
   */
  compare(p: ConvexHullPoint): number {
    if (this.angle < p.angle) {
      return -1;
    } else if (this.angle > p.angle) {
      return 1;
    } else {
      if (this.distance < p.distance) {
        return -1;
      } else if (this.distance > p.distance) {
        return 1;
      }
    }
    return 0;
  };
}
