const Matrix4x4 = require('../core/math/Matrix4.js');
const Vector3D = require('../core/math/Vector3.js');
const {Connector} = require('../core/connectors.js');
const {fromPoints} = require('../core/CAGFactories');
const Vector2D = require('../core/math/Vector2');

// Get the transformation that transforms this CSG such that it is lying on the z=0 plane,
// as flat as possible (i.e. the least z-height).
// So that it is in an orientation suitable for CNC milling
export const getTransformationAndInverseTransformationToFlatLying = (_csg: any) => {
  if (_csg.polygons.length === 0) {
    const m = new Matrix4x4(); // unity
    return [m, m];
  } else {
    // get a list of unique planes in the CSG:
    const csg = _csg.canonicalized();
    const planemap: any = {};
    csg.polygons.map((polygon: any) => {
      planemap[polygon.plane.getTag()] = polygon.plane;
    });
    // try each plane in the CSG and find the plane that, when we align it flat onto z=0,
    // gives the least height in z-direction.
    // If two planes give the same height, pick the plane that originally had a normal closest
    // to [0,0,-1].
    const xvector = new Vector3D(1, 0, 0);
    const yvector = new Vector3D(0, 1, 0);
    const zvector = new Vector3D(0, 0, 1);
    const z0connectorx = new Connector([0, 0, 0], [0, 0, -1], xvector);
    const z0connectory = new Connector([0, 0, 0], [0, 0, -1], yvector);
    let isfirst = true;
    let minheight = 0;
    let maxdotz = 0;
    let besttransformation;
    let bestinversetransformation;

    // tslint:disable-next-line:forin
    for (const planetag in planemap) {
      const plane = planemap[planetag];
      const pointonplane = plane.normal.times(plane.w);
      let transformation;
      let inversetransformation;
      // We need a normal vecrtor for the transformation
      // determine which is more perpendicular to the plane normal: x or y?
      // we will align this as much as possible to the x or y axis vector
      const xorthogonality = plane.normal.cross(xvector).length();
      const yorthogonality = plane.normal.cross(yvector).length();
      if (xorthogonality > yorthogonality) {
        // x is better:
        const planeconnector = new Connector(pointonplane, plane.normal, xvector);
        transformation = planeconnector.getTransformationTo(z0connectorx, false, 0);
        inversetransformation = z0connectorx.getTransformationTo(planeconnector, false, 0);
      } else {
        // y is better:
        const planeconnector = new Connector(pointonplane, plane.normal, yvector);
        transformation = planeconnector.getTransformationTo(z0connectory, false, 0);
        inversetransformation = z0connectory.getTransformationTo(planeconnector, false, 0);
      }
      const transformedcsg = csg.transform(transformation);
      const dotz = -plane.normal.dot(zvector);
      const bounds = transformedcsg.getBounds();
      const zheight = bounds[1].z - bounds[0].z;
      let isbetter = isfirst;
      if (!isbetter) {
        if (zheight < minheight) {
          isbetter = true;
        } else if (zheight === minheight) {
          if (dotz > maxdotz) isbetter = true;
        }
      }
      if (isbetter) {
        // translate the transformation around the z-axis and onto the z plane:
        const translation = new Vector3D([-0.5 * (bounds[1].x + bounds[0].x), -0.5 * (bounds[1].y + bounds[0].y), -bounds[0].z]);
        transformation = transformation.multiply(Matrix4x4.translation(translation));
        inversetransformation = Matrix4x4.translation(translation.negated()).multiply(inversetransformation);
        minheight = zheight;
        maxdotz = dotz;
        besttransformation = transformation;
        bestinversetransformation = inversetransformation;
      }
      isfirst = false;
    }
    return [besttransformation, bestinversetransformation];
  }
};

export const getTransformationToFlatLying = (csg: any) => {
  const result = csg.getTransformationAndInverseTransformationToFlatLying();
  return result[0];
};

export const lieFlat = (csg: any) => {
  const transformation = csg.getTransformationToFlatLying();
  return csg.transform(transformation);
};

/** cag = cag.overCutInsideCorners(cutterradius);
 * Using a CNC router it's impossible to cut out a true sharp inside corner. The inside corner
 * will be rounded due to the radius of the cutter. This function compensates for this by creating
 * an extra cutout at each inner corner so that the actual cut out shape will be at least as large
 * as needed.
 * @param {Object} _cag - input cag
 * @param {Float} cutterradius - radius to cut inside corners by
 * @returns {CAG} cag with overcutInsideCorners
 */
export const overCutInsideCorners = (_cag: any, cutterradius: number) => {
  const cag = _cag.canonicalized();
  // for each vertex determine the 'incoming' side and 'outgoing' side:
  const pointmap: any = {}; // tag => {pos: coord, from: [], to: []}
  cag.sides.map((side: any) => {
    if (!(side.vertex0.getTag() in pointmap)) {
      pointmap[side.vertex0.getTag()] = {
        pos: side.vertex0.pos,
        from: [],
        to: [],
      };
    }
    pointmap[side.vertex0.getTag()].to.push(side.vertex1.pos);
    if (!(side.vertex1.getTag() in pointmap)) {
      pointmap[side.vertex1.getTag()] = {
        pos: side.vertex1.pos,
        from: [],
        to: [],
      };
    }
    pointmap[side.vertex1.getTag()].from.push(side.vertex0.pos);
  });
  // overcut all sharp corners:
  const cutouts = [];

  // tslint:disable-next-line:forin
  for (const pointtag in pointmap) {
    const pointobj = pointmap[pointtag];
    if ((pointobj.from.length === 1) && (pointobj.to.length === 1)) {
      // ok, 1 incoming side and 1 outgoing side:
      const fromcoord = pointobj.from[0];
      const pointcoord = pointobj.pos;
      const tocoord = pointobj.to[0];
      const v1 = pointcoord.minus(fromcoord).unit();
      const v2 = tocoord.minus(pointcoord).unit();
      const crossproduct = v1.cross(v2);
      const isInnerCorner = (crossproduct < 0.001);
      if (isInnerCorner) {
        // yes it's a sharp corner:
        let alpha = v2.angleRadians() - v1.angleRadians() + Math.PI;
        if (alpha < 0) {
          alpha += 2 * Math.PI;
        } else if (alpha >= 2 * Math.PI) {
          alpha -= 2 * Math.PI;
        }
        const midvector = v2.minus(v1).unit();
        const circlesegmentangle = 30 / 180 * Math.PI; // resolution of the circle: segments of 30 degrees
        // we need to increase the radius slightly so that our imperfect circle will contain a perfect circle of cutterradius
        const radiuscorrected = cutterradius / Math.cos(circlesegmentangle / 2);
        const circlecenter = pointcoord.plus(midvector.times(radiuscorrected));
        // we don't need to create a full circle; a pie is enough. Find the angles for the pie:
        const startangle = alpha + midvector.angleRadians();
        const deltaangle = 2 * (Math.PI - alpha);
        const numsteps = 2 * Math.ceil(deltaangle / circlesegmentangle / 2); // should be even
        // build the pie:
        const points = [circlecenter];
        for (let i = 0; i <= numsteps; i++) {
          const angle = startangle + i / numsteps * deltaangle;
          const p = Vector2D.fromAngleRadians(angle).times(radiuscorrected).plus(circlecenter);
          points.push(p);
        }
        cutouts.push(fromPoints(points));
      }
    }
  }
  return cag.subtract(cutouts);
};
