import {Vector2} from '../math/Vector2';
import {CAG} from '../CAG';

// see http://local.wasp.uwa.edu.au/~pbourke/geometry/polyarea/ :
// Area of the polygon. For a counter clockwise rotating polygon the area is positive, otherwise negative
// Note(bebbi): this looks wrong. See polygon getArea()
export const area = (cag: CAG) => {
  let polygonArea = 0;
  cag.sides.map((side) => {
    polygonArea += side.vertex0.pos.cross(side.vertex1.pos);
  });
  polygonArea *= 0.5;
  return polygonArea;
};

export const getBounds = (cag: CAG) => {
  let minpoint: any;
  if (cag.sides.length === 0) {
    minpoint = new Vector2(0, 0);
  } else {
    minpoint = cag.sides[0].vertex0.pos;
  }
  let maxpoint = minpoint;
  cag.sides.map((side) => {
    minpoint = minpoint.min(side.vertex0.pos);
    minpoint = minpoint.min(side.vertex1.pos);
    maxpoint = maxpoint.max(side.vertex0.pos);
    maxpoint = maxpoint.max(side.vertex1.pos);
  });
  return [minpoint, maxpoint];
};
