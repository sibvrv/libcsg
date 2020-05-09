/**
 * Convex Hull Point
 */
export class ConvexHullPoint {
  constructor(public index: number, public angle: number, public distance: number) {
  }

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
