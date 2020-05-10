import {Vector2} from '@core/math';

/**
 * Get the x coordinate of a point with a certain y coordinate, interpolated between two points (CSG.Vector2D).
 * Interpolation is robust even if the points have the same y coordinate
 * @param point1
 * @param point2
 * @param y
 */
export const interpolateBetween2DPointsForY = (point1: Vector2, point2: Vector2, y: number) => {
  let f1 = y - point1.y;
  let f2 = point2.y - point1.y;
  if (f2 < 0) {
    f1 = -f1;
    f2 = -f2;
  }
  let t;
  if (f1 <= 0) {
    t = 0.0;
  } else if (f1 >= f2) {
    t = 1.0;
  } else if (f2 < 1e-10) { // FIXME Should this be CSG.EPS?
    t = 0.5;
  } else {
    t = f1 / f2;
  }
  const result = point1.x + t * (point2.x - point1.x);
  return result;
};
