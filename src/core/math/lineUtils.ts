import {EPS} from '@core/constants';
import {solve2Linear} from '@core/utils/utils';

// see if the line between p0start and p0end intersects with the line between p1start and p1end
// returns true if the lines strictly intersect, the end points are not counted!
export const linesIntersect = (p0start: any, p0end: any, p1start: any, p1end: any) => {
  if (p0end.equals(p1start) || p1end.equals(p0start)) {
    const d = p1end.minus(p1start).unit().plus(p0end.minus(p0start).unit()).length();
    if (d < EPS) {
      return true;
    }
  } else {
    const d0 = p0end.minus(p0start);
    const d1 = p1end.minus(p1start);
    // FIXME These epsilons need review and testing
    if (Math.abs(d0.cross(d1)) < 1e-9) return false; // lines are parallel
    const alphas = solve2Linear(-d0.x, d1.x, -d0.y, d1.y, p0start.x - p1start.x, p0start.y - p1start.y);
    if ((alphas[0] > 1e-6) && (alphas[0] < 0.999999) && (alphas[1] > 1e-5) && (alphas[1] < 0.999999)) return true;
    // if( (alphas[0] >= 0) && (alphas[0] <= 1) && (alphas[1] >= 0) && (alphas[1] <= 1) ) return true;
  }
  return false;
};
