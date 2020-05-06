// @ts-nocheck

import CAG from '../../core/CAG';
import {parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt} from '../../api/optionParsers';
import {defaultResolution2D} from '../../core/constants';
import {fromPath2, fromPoints} from '../../core/CAGFactories';
import Vector2D from '../../core/math/Vector2';
import Path2D from '../../core/math/Path2';

/** Construct a circle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of circle
 * @param {Number} [options.radius=1] - radius of circle
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 */
export const circle = (options: any) => {
  options = options || {};
  const center = parseOptionAs2DVector(options, 'center', [0, 0]);
  const radius = parseOptionAsFloat(options, 'radius', 1);
  const resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D);
  const points = [];
  for (let i = 0; i < resolution; i++) {
    const radians = 2 * Math.PI * i / resolution;
    const point = Vector2D.fromAngleRadians(radians).times(radius).plus(center);
    points.push(point);
  }
  return fromPoints(points);
};

/** Construct an ellispe.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of ellipse
 * @param {Vector2D} [options.radius=[1,1]] - radius of ellipse, width and height
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 */
export const ellipse = (options: any) => {
  options = options || {};
  const c = parseOptionAs2DVector(options, 'center', [0, 0]);
  let r = parseOptionAs2DVector(options, 'radius', [1, 1]);
  r = r.abs(); // negative radii make no sense
  const res = parseOptionAsInt(options, 'resolution', defaultResolution2D);

  let e2 = new Path2D([[c.x, c.y + r.y]]);
  e2 = e2.appendArc([c.x, c.y - r.y], {
    xradius: r.x,
    yradius: r.y,
    xaxisrotation: 0,
    resolution: res,
    clockwise: true,
    large: false,
  });
  e2 = e2.appendArc([c.x, c.y + r.y], {
    xradius: r.x,
    yradius: r.y,
    xaxisrotation: 0,
    resolution: res,
    clockwise: true,
    large: false,
  });
  e2 = e2.close();
  return fromPath2(e2);
};

/** Construct a rectangle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of rectangle
 * @param {Vector2D} [options.radius=[1,1]] - radius of rectangle, width and height
 * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rectangle (alternate)
 * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rectangle (alternate)
 * @returns {CAG} new CAG object
 */
export const rectangle = (options: any) => {
  options = options || {};
  let c;
  let r;
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('rectangle: should either give a radius and center parameter, or a corner1 and corner2 parameter');
    }
    const corner1 = parseOptionAs2DVector(options, 'corner1', [0, 0]);
    const corner2 = parseOptionAs2DVector(options, 'corner2', [1, 1]);
    c = corner1.plus(corner2).times(0.5);
    r = corner2.minus(corner1).times(0.5);
  } else {
    c = parseOptionAs2DVector(options, 'center', [0, 0]);
    r = parseOptionAs2DVector(options, 'radius', [1, 1]);
  }
  r = r.abs(); // negative radii make no sense
  const rswap = new Vector2D(r.x, -r.y);
  const points = [
    c.plus(r), c.plus(rswap), c.minus(r), c.minus(rswap),
  ];
  return fromPoints(points);
};

/** Construct a rounded rectangle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of rounded rectangle
 * @param {Vector2D} [options.radius=[1,1]] - radius of rounded rectangle, width and height
 * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rounded rectangle (alternate)
 * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rounded rectangle (alternate)
 * @param {Number} [options.roundradius=0.2] - round radius of corners
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 *
 * @example
 * let r = roundedRectangle({
 *   center: [0, 0],
 *   radius: [5, 10],
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
export const roundedRectangle = (options: any) => {
  options = options || {};
  let center;
  let radius;
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('roundedRectangle: should either give a radius and center parameter, or a corner1 and corner2 parameter');
    }
    const corner1 = parseOptionAs2DVector(options, 'corner1', [0, 0]);
    const corner2 = parseOptionAs2DVector(options, 'corner2', [1, 1]);
    center = corner1.plus(corner2).times(0.5);
    radius = corner2.minus(corner1).times(0.5);
  } else {
    center = parseOptionAs2DVector(options, 'center', [0, 0]);
    radius = parseOptionAs2DVector(options, 'radius', [1, 1]);
  }
  radius = radius.abs(); // negative radii make no sense
  let roundradius = parseOptionAsFloat(options, 'roundradius', 0.2);
  const resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D);
  let maxroundradius = Math.min(radius.x, radius.y);
  maxroundradius -= 0.1;
  roundradius = Math.min(roundradius, maxroundradius);
  roundradius = Math.max(0, roundradius);
  radius = new Vector2D(radius.x - roundradius, radius.y - roundradius);
  let rect = rectangle({
    center,
    radius,
  });
  if (roundradius > 0) {
    rect = rect.expand(roundradius, resolution);
  }
  return rect;
};
