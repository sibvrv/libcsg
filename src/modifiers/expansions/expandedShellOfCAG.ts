import {EPS, angleEPS} from '../../core/constants';
import Vector2D from '../../core/math/Vector2';
import {fromPoints, fromPointsNoCheck} from '../../core/CAGFactories';
import CAG from '../../core/CAG';

/**
 * Expanded Shell Of CAG
 * @param _cag
 * @param radius
 * @param resolution
 */
export const expandedShellOfCAG = (_cag: any, radius: number, resolution: number) => {
  resolution = resolution || 8;
  if (resolution < 4) resolution = 4;
  const cags = [];
  const pointmap: any = {};
  const cag = _cag.canonicalized();
  cag.sides.map((side: any) => {
    let d = side.vertex1.pos.minus(side.vertex0.pos);
    const dl = d.length();
    if (dl > EPS) {
      d = d.times(1.0 / dl);
      const normal = d.normal().times(radius);
      const shellpoints = [
        side.vertex1.pos.plus(normal),
        side.vertex1.pos.minus(normal),
        side.vertex0.pos.minus(normal),
        side.vertex0.pos.plus(normal),
      ];
      //      let newcag = fromPointsNoCheck(shellpoints);
      const newcag = fromPoints(shellpoints);
      cags.push(newcag);
      for (let step = 0; step < 2; step++) {
        const p1 = (step === 0) ? side.vertex0.pos : side.vertex1.pos;
        const p2 = (step === 0) ? side.vertex1.pos : side.vertex0.pos;
        const tag = p1.x + ' ' + p1.y;
        if (!(tag in pointmap)) {
          pointmap[tag] = [];
        }
        pointmap[tag].push({
          'p1': p1,
          'p2': p2,
        });
      }
    }
  });

  // tslint:disable-next-line:forin
  for (const tag in pointmap) {
    const m = pointmap[tag];

    let angle1;
    let angle2;

    const pcenter = m[0].p1;
    if (m.length === 2) {
      const end1 = m[0].p2;
      const end2 = m[1].p2;
      angle1 = end1.minus(pcenter).angleDegrees();
      angle2 = end2.minus(pcenter).angleDegrees();
      if (angle2 < angle1) angle2 += 360;
      if (angle2 >= (angle1 + 360)) angle2 -= 360;
      if (angle2 < angle1 + 180) {
        const t = angle2;
        angle2 = angle1 + 360;
        angle1 = t;
      }
      angle1 += 90;
      angle2 -= 90;
    } else {
      angle1 = 0;
      angle2 = 360;
    }
    const fullcircle = (angle2 > angle1 + 359.999);
    if (fullcircle) {
      angle1 = 0;
      angle2 = 360;
    }
    if (angle2 > (angle1 + angleEPS)) {
      const points = [];
      if (!fullcircle) {
        points.push(pcenter);
      }
      let numsteps = Math.round(resolution * (angle2 - angle1) / 360);
      if (numsteps < 1) numsteps = 1;
      for (let step = 0; step <= numsteps; step++) {
        let angle = angle1 + step / numsteps * (angle2 - angle1);
        if (step === numsteps) angle = angle2; // prevent rounding errors
        const point = pcenter.plus(Vector2D.fromAngleDegrees(angle).times(radius));
        if ((!fullcircle) || (step > 0)) {
          points.push(point);
        }
      }
      const newcag = fromPointsNoCheck(points);
      cags.push(newcag);
    }
  }
  let result = new CAG();
  result = result.union(cags);
  return result;
};
