// @ts-nocheck

import Vector2D from '../math/Vector2';

// see http://local.wasp.uwa.edu.au/~pbourke/geometry/polyarea/ :
// Area of the polygon. For a counter clockwise rotating polygon the area is positive, otherwise negative
// Note(bebbi): this looks wrong. See polygon getArea()
export const area = (cag: any) => {
  let polygonArea = 0;
  cag.sides.map((side: any) => {
    polygonArea += side.vertex0.pos.cross(side.vertex1.pos);
  });
  polygonArea *= 0.5;
  return polygonArea;
};

export const getBounds = (cag: any) => {
  let minpoint: any;
  if (cag.sides.length === 0) {
    minpoint = new Vector2D(0, 0);
  } else {
    minpoint = cag.sides[0].vertex0.pos;
  }
  let maxpoint = minpoint;
  cag.sides.map((side: any) => {
    minpoint = minpoint.min(side.vertex0.pos);
    minpoint = minpoint.min(side.vertex1.pos);
    maxpoint = maxpoint.max(side.vertex0.pos);
    maxpoint = maxpoint.max(side.vertex1.pos);
  });
  return [minpoint, maxpoint];
};
