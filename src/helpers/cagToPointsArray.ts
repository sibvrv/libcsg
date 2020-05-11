/**
 * Cag To Points Array
 * @param input
 */
export const cagToPointsArray = (input: any) => {
  let points;
  if ('sides' in input) { // this is a cag
    points = [];
    input.sides.forEach((side: any) => {
      points.push([side.vertex0.pos.x, side.vertex0.pos.y]);
      points.push([side.vertex1.pos.x, side.vertex1.pos.y]);
    });
    // cag.sides.map(side => [side.vertex0.pos.x, side.vertex0.pos.y])
    // , side.vertex1.pos.x, side.vertex1.pos.y])
    // due to the logic of CAG.fromPoints()
    // move the first point to the last
    /* if (points.length > 0) {
      points.push(points.shift())
    } */
  } else if ('points' in input) {
    points = input.points.map((p: any) => ([p.x, p.y]));
  }

  return points;
};
