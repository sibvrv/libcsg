// @ts-nocheck

import {EPS, defaultResolution3D} from '../../core/constants';
import {parseOptionAsFloat, parseOptionAsInt} from '../../api/optionParsers';
import Vector3D from '../../core/math/Vector3';
import {Connector} from '../../core/connectors';
import {fromPolygons} from '../../core/CSGFactories';

// THIS IS AN OLD untested !!! version of rotate extrude
/** Extrude to into a 3D solid by rotating the origin around the Y axis.
 * (and turning everything into XY plane)
 * @param {Object} options - options for construction
 * @param {Number} [options.angle=360] - angle of rotation
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 */
export const rotateExtrude = (cag: any, options: any) => {
  if (options === undefined) {
    options = {};
  }
  let alpha = parseOptionAsFloat(options, 'angle', 360);
  const resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D);

  alpha = alpha > 360 ? alpha % 360 : alpha;
  const origin = [0, 0, 0];
  const axisV = Vector3D.Create(0, 1, 0);
  const normalV = [0, 0, 1];
  let polygons: any[] = [];
  // planes only needed if alpha > 0
  const connS = new Connector(origin, axisV, normalV);
  if (alpha > 0 && alpha < 360) {
    // we need to rotate negative to satisfy wall function condition of
    // building in the direction of axis vector
    const connE = new Connector(origin, axisV.rotateZ(-alpha), normalV);
    polygons = polygons.concat(
      cag._toPlanePolygons({toConnector: connS, flipped: true}));
    polygons = polygons.concat(
      cag._toPlanePolygons({toConnector: connE}));
  }
  let connT1 = connS;
  let connT2;
  const step = alpha / resolution;
  const iteration = 0;
  for (let a = step; a <= alpha + EPS; a += step) { // FIXME Should this be angelEPS?
    connT2 = new Connector(origin, axisV.rotateZ(-a), normalV);
    polygons = polygons.concat(cag._toWallPolygons(
      {toConnector1: connT1, toConnector2: connT2}, iteration));
    connT1 = connT2;
  }
  return fromPolygons(polygons).reTesselated();
};
