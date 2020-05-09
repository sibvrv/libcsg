import {defaultResolution3D} from '@core/constants';
import {parseOptionAs3DVector, parseOptionAsFloat, parseOptionAsInt} from '@api/optionParsers';
import {fromPolygons} from '@core/CSGFactories';
import {Connector} from '@core/Connector';
import {Vector3} from '@core/math';
import {CSG} from '@core/CSG';

/**
 * Linear extrusion of 2D shape, with optional twist
 * @param  {CAG} cag the cag to extrude
 * @param  {Object} [options] - options for construction
 * @param {Array} [options.offset=[0,0,1]] - The 2d shape is placed in in z=0 plane and extruded into direction <offset>
 * (a 3D vector as a 3 component array)
 * @param {Boolean} [options.twiststeps=defaultResolution3D] - twiststeps determines the resolution of the twist (should be >= 1)
 * @param {Boolean} [options.twistangle=0] - twistangle The final face is rotated <twistangle> degrees. Rotation is done around the origin of the 2d shape (i.e. x=0, y=0)
 * @returns {CSG} the extrude shape, as a CSG object
 * @example extruded=cag.extrude({offset: [0,0,10], twistangle: 360, twiststeps: 100});
 */
export const extrude = (cag: any, options: any) => {
  if (cag.sides.length === 0) {
    // empty! : FIXME: should this throw ?
    return new CSG();
  }
  const offsetVector = parseOptionAs3DVector(options, 'offset', [0, 0, 1]);
  const twistangle = parseOptionAsFloat(options, 'twistangle', 0);
  let twiststeps = parseOptionAsInt(options, 'twiststeps', defaultResolution3D);
  if (offsetVector.z === 0) {
    throw new Error('offset cannot be orthogonal to Z axis');
  }
  if (twistangle === 0 || twiststeps < 1) {
    twiststeps = 1;
  }
  const normalVector = Vector3.Create(0, 1, 0);

  let polygons: any[] = [];
  // bottom and top
  polygons = polygons.concat(cag._toPlanePolygons({
      translation: [0, 0, 0],
      normalVector,
      flipped: !(offsetVector.z < 0),
    },
  ));
  polygons = polygons.concat(cag._toPlanePolygons({
    translation: offsetVector,
    normalVector: normalVector.rotateZ(twistangle),
    flipped: offsetVector.z < 0,
  }));
  // walls
  for (let i = 0; i < twiststeps; i++) {
    const c1 = new Connector(offsetVector.times(i / twiststeps), [0, 0, offsetVector.z],
      normalVector.rotateZ(i * twistangle / twiststeps));
    const c2 = new Connector(offsetVector.times((i + 1) / twiststeps), [0, 0, offsetVector.z],
      normalVector.rotateZ((i + 1) * twistangle / twiststeps));
    polygons = polygons.concat(cag._toWallPolygons({toConnector1: c1, toConnector2: c2}, i));
  }

  return fromPolygons(polygons);
};
