import {angleEPS, defaultResolution2D, EPS} from '../constants';
import {parseOptionAs2DVector, parseOptionAsBool, parseOptionAsFloat, parseOptionAsInt} from '../../api/optionParsers';
import {CAG} from '../CAG';
import {Matrix4x4, Side, TransformationMethods, TVector2Universal, Vector2, Vertex2} from '.';

export interface IPath2DArcOptions {
  center: any;
  radius: number;
  startangle: number;
  endangle: number;
  resolution: number;
  maketangent: boolean;
}

/**
 * Class Path2D
 * Represents a series of points, connected by infinitely thin lines.
 * A path can be open or closed, i.e. additional line between first and last points.
 * The difference between Path2D and CAG is that a path is a 'thin' line, whereas a CAG is an enclosed area.
 * @constructor
 * @param {Vector2[]} [points=[]] - list of points
 * @param {boolean} [closed=false] - closer of path
 *
 * @example
 * new CSG.Path2D()
 * new CSG.Path2D([[10,10], [-10,10], [-10,-10], [10,-10]], true) // closed
 */
export class Path2D extends TransformationMethods {
  lastBezierControlPoint?: Vector2;

  points: Vector2[] = [];
  closed = false;

  /**
   * Construct an arc.
   * @param {Object} [options] - options for construction
   * @param {Vector2} [options.center=[0,0]] - center of circle
   * @param {Number} [options.radius=1] - radius of circle
   * @param {Number} [options.startangle=0] - starting angle of the arc, in degrees
   * @param {Number} [options.endangle=360] - ending angle of the arc, in degrees
   * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
   * @param {Boolean} [options.maketangent=false] - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent
   * @returns {Path2D} new Path2D object (not closed)
   *
   * @example
   * let path = CSG.Path2D.arc({
   *   center: [5, 5],
   *   radius: 10,
   *   startangle: 90,
   *   endangle: 180,
   *   resolution: 36,
   *   maketangent: true
   * });
   */
  static arc(options: Partial<IPath2DArcOptions> = {}) {
    const center = parseOptionAs2DVector(options, 'center', 0);
    const radius = parseOptionAsFloat(options, 'radius', 1);
    const startangle = parseOptionAsFloat(options, 'startangle', 0);
    let endangle = parseOptionAsFloat(options, 'endangle', 360);
    const resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D);
    const maketangent = parseOptionAsBool(options, 'maketangent', false);
    // no need to make multiple turns:
    while (endangle - startangle >= 720) {
      endangle -= 360;
    }
    while (endangle - startangle <= -720) {
      endangle += 360;
    }
    const points = [];
    let point;
    const absangledif = Math.abs(endangle - startangle);
    if (absangledif < angleEPS) {
      point = Vector2.fromAngle(startangle / 180.0 * Math.PI).times(radius);
      points.push(point.plus(center));
    } else {
      const numsteps = Math.floor(resolution * absangledif / 360) + 1;
      let edgestepsize = numsteps * 0.5 / absangledif; // step size for half a degree
      if (edgestepsize > 0.25) edgestepsize = 0.25;
      const numstepsMod = maketangent ? (numsteps + 2) : numsteps;
      for (let i = 0; i <= numstepsMod; i++) {
        let step = i;
        if (maketangent) {
          step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize;
          if (step < 0) step = 0;
          if (step > numsteps) step = numsteps;
        }
        const angle = startangle + step * (endangle - startangle) / numsteps;
        point = Vector2.fromAngle(angle / 180.0 * Math.PI).times(radius);
        points.push(point.plus(center));
      }
    }
    return new Path2D(points, false);
  }

  constructor(points?: number[][] | Vector2[], closed: boolean = false) {
    super();

    closed = !!closed;
    points = points || [];
    // re-parse the points into Vector2
    // and remove any duplicate points
    let prevpoint: Vector2 = null!;
    if (closed && (points.length > 0)) {
      prevpoint = new Vector2(points[points.length - 1]);
    }
    const newpoints: Vector2[] = [];
    points.forEach((point: number[] | Vector2) => {
      const vPoint = new Vector2(point);
      let skip = false;
      if (prevpoint !== null) {
        const distance = vPoint.distanceTo(prevpoint);
        skip = distance < EPS;
      }
      if (!skip) newpoints.push(vPoint);
      prevpoint = vPoint;
    });
    this.points = newpoints;
    this.closed = closed;
  }

  concat(otherpath: Path2D) {
    if (this.closed || otherpath.closed) {
      throw new Error('Paths must not be closed');
    }
    const newpoints = this.points.concat(otherpath.points);
    return new Path2D(newpoints);
  }

  /**
   * Get the points that make up the path.
   * note that this is current internal list of points, not an immutable copy.
   * @returns {Vector2[]} array of points the make up the path
   */
  getPoints() {
    return this.points;
  }

  /**
   * Append an point to the end of the path.
   * @param {Vector2} point - point to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoint(point: number[] | Vector2) {
    if (this.closed) {
      throw new Error('Path must not be closed');
    }
    point = new Vector2(point); // cast to Vector2
    const newpoints = this.points.concat([point]);
    return new Path2D(newpoints);
  }

  /**
   * Append a list of points to the end of the path.
   * @param {Vector2[]} points - points to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoints(points: number[][] | Vector2[]) {
    if (this.closed) {
      throw new Error('Path must not be closed');
    }
    const newpoints = this.points;
    points.forEach((point: number[] | Vector2) => {
      newpoints.push(new Vector2(point)); // cast to Vector2
    });
    return new Path2D(newpoints);
  }

  close() {
    return new Path2D(this.points, true);
  }

  /**
   * Determine if the path is a closed or not.
   * @returns {Boolean} true when the path is closed, otherwise false
   */
  isClosed() {
    return this.closed;
  }

  /**
   * Determine the overall clockwise or anti-clockwise turn of a path.
   * See: http://mathworld.wolfram.com/PolygonArea.html
   * @returns {String} One of ['clockwise', 'counter-clockwise', 'straight'].
   */
  getTurn() {
    const points = this.points;
    let twiceArea = 0;
    let last = points.length - 1;
    for (let current = 0; current < points.length; last = current++) {
      twiceArea += points[last].x * points[current].y - points[last].y * points[current].x;
    }
    if (twiceArea > 0) {
      return 'clockwise';
    } else if (twiceArea < 0) {
      return 'counter-clockwise';
    } else {
      return 'straight';
    }
  }

  // Extrude the path by following it with a rectangle (upright, perpendicular to the path direction)
  // Returns a CSG solid
  //   width: width of the extrusion, in the z=0 plane
  //   height: height of the extrusion in the z direction
  //   resolution: number of segments per 360 degrees for the curve in a corner
  rectangularExtrude(width: number, height: number, resolution: number) {
    const cag = this.expandToCAG(width / 2, resolution);
    const result = cag.extrude({
      offset: [0, 0, height],
    });
    return result;
  }

  // Expand the path to a CAG
  // This traces the path with a circle with radius pathradius
  expandToCAG(pathradius: number, resolution: number) {
    const sides = [];
    const numpoints = this.points.length;
    let startindex = 0;
    if (this.closed && (numpoints > 2)) startindex = -1;
    let prevvertex;
    for (let i = startindex; i < numpoints; i++) {
      let pointindex = i;
      if (pointindex < 0) pointindex = numpoints - 1;
      const point = this.points[pointindex];
      const vertex = new Vertex2(point);
      if (prevvertex && i > startindex) {
        const side = new Side(prevvertex, vertex);
        sides.push(side);
      }
      prevvertex = vertex;
    }
    const shellcag = CAG.fromSides(sides);
    const expanded = shellcag.expandedShell(pathradius, resolution);
    return expanded;
  }

  innerToCAG() {
    if (!this.closed) throw new Error('The path should be closed!');
    return CAG.fromPoints(this.points);
  }

  transform(matrix4x4: Matrix4x4): Path2D {
    const newpoints = this.points.map((point) => point.multiply4x4(matrix4x4));
    return new Path2D(newpoints, this.closed);
  }

  /**
   * Append a Bezier curve to the end of the path, using the control points to transition the curve through start and end points.
   * <br>
   * The Bézier curve starts at the last point in the path,
   * and ends at the last given control point. Other control points are intermediate control points.
   * <br>
   * The first control point may be null to ensure a smooth transition occurs. In this case,
   * the second to last control point of the path is mirrored into the control points of the Bezier curve.
   * In other words, the trailing gradient of the path matches the new gradient of the curve.
   * @param {Vector2[]} controlpoints - list of control points
   * @param {Object} [options] - options for construction
   * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
   * @returns {Path2D} new Path2D object (not closed)
   *
   * @example
   * let p5 = new CSG.Path2D([[10,-20]],false);
   * p5 = p5.appendBezier([[10,-10],[25,-10],[25,-20]]);
   * p5 = p5.appendBezier([[25,-30],[40,-30],[40,-20]]);
   */
  appendBezier(controlpoints: number[][] | Vector2[], options?: any) {
    if (arguments.length < 2) {
      options = {};
    }
    if (this.closed) {
      throw new Error('Path must not be closed');
    }
    if (!(controlpoints instanceof Array)) {
      throw new Error('appendBezier: should pass an array of control points');
    }
    if (controlpoints.length < 1) {
      throw new Error('appendBezier: need at least 1 control point');
    }
    if (this.points.length < 1) {
      throw new Error('appendBezier: path must already contain a point (the endpoint of the path is used as the starting point for the bezier curve)');
    }
    let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D);
    if (resolution < 4) resolution = 4;
    const factorials = [];
    const controlpointsParsed: Vector2[] = [];
    controlpointsParsed.push(this.points[this.points.length - 1]); // start at the previous end point
    for (let i = 0; i < controlpoints.length; ++i) {
      let p = controlpoints[i];
      if (p === null) {
        // we can pass null as the first control point. In that case a smooth gradient is ensured:
        if (i !== 0) {
          throw new Error('appendBezier: null can only be passed as the first control point');
        }
        if (controlpoints.length < 2) {
          throw new Error('appendBezier: null can only be passed if there is at least one more control point');
        }
        let lastBezierControlPoint;
        if (this.lastBezierControlPoint) {
          lastBezierControlPoint = this.lastBezierControlPoint;
        } else {
          if (this.points.length < 2) {
            throw new Error('appendBezier: null is passed as a control point but this requires a previous bezier curve or at least two points in the existing path');
          }
          lastBezierControlPoint = this.points[this.points.length - 2];
        }
        // mirror the last bezier control point:
        p = this.points[this.points.length - 1].times(2).minus(lastBezierControlPoint);
      } else {
        p = new Vector2(p); // cast to Vector2
      }
      controlpointsParsed.push(p);
    }
    const bezierOrder = controlpointsParsed.length - 1;
    let fact = 1;
    for (let i = 0; i <= bezierOrder; ++i) {
      if (i > 0) fact *= i;
      factorials.push(fact);
    }
    const binomials: number[] = [];
    for (let i = 0; i <= bezierOrder; ++i) {
      const binomial = factorials[bezierOrder] / (factorials[i] * factorials[bezierOrder - i]);
      binomials.push(binomial);
    }
    const getPointForT = (t: number) => {
      let tK = 1; // = pow(t,k)
      let oneMinusTNMinusK = Math.pow(1 - t, bezierOrder); // = pow( 1-t, bezierOrder - k)
      const inv1MinusT = (t !== 1) ? (1 / (1 - t)) : 1;
      let point = new Vector2(0, 0);
      for (let k = 0; k <= bezierOrder; ++k) {
        if (k === bezierOrder) oneMinusTNMinusK = 1;
        const bernsteinCoefficient = binomials[k] * tK * oneMinusTNMinusK;
        point = point.plus(controlpointsParsed[k].times(bernsteinCoefficient));
        tK *= t;
        oneMinusTNMinusK *= inv1MinusT;
      }
      return point;
    };
    let newpoints = [];
    const newpointsT: number[] = [];
    const numsteps = bezierOrder + 1;
    for (let i = 0; i < numsteps; ++i) {
      const t = i / (numsteps - 1);
      const point = getPointForT(t);
      newpoints.push(point);
      newpointsT.push(t);
    }
    // subdivide each segment until the angle at each vertex becomes small enough:
    let subdivideBase = 1;
    const maxangle = Math.PI * 2 / resolution; // segments may have differ no more in angle than this
    const maxsinangle = Math.sin(maxangle);
    while (subdivideBase < newpoints.length - 1) {
      const dir1 = newpoints[subdivideBase].minus(newpoints[subdivideBase - 1]).unit();
      const dir2 = newpoints[subdivideBase + 1].minus(newpoints[subdivideBase]).unit();
      const sinangle = dir1.cross(dir2); // this is the sine of the angle
      if (Math.abs(sinangle) > maxsinangle) {
        // angle is too big, we need to subdivide
        const t0 = newpointsT[subdivideBase - 1];
        const t1 = newpointsT[subdivideBase + 1];
        const t0New = t0 + (t1 - t0) * 1 / 3;
        const t1New = t0 + (t1 - t0) * 2 / 3;
        const point0New = getPointForT(t0New);
        const point1New = getPointForT(t1New);
        // remove the point at subdivideBase and replace with 2 new points:
        newpoints.splice(subdivideBase, 1, point0New, point1New);
        newpointsT.splice(subdivideBase, 1, t0New, t1New);
        // re - evaluate the angles, starting at the previous junction since it has changed:
        subdivideBase--;
        if (subdivideBase < 1) subdivideBase = 1;
      } else {
        ++subdivideBase;
      }
    }
    // append to the previous points, but skip the first new point because it is identical to the last point:
    newpoints = this.points.concat(newpoints.slice(1));
    const result = new Path2D(newpoints);
    result.lastBezierControlPoint = controlpointsParsed[controlpointsParsed.length - 2];
    return result;
  }

  /**
   * Append an arc to the end of the path.
   * This implementation follows the SVG arc specs. For the details see
   * http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
   * @param {Vector2} endpoint - end point of arc
   * @param {Object} [options] - options for construction
   * @param {Number} [options.radius=0] - radius of arc (X and Y), see also xradius and yradius
   * @param {Number} [options.xradius=0] - X radius of arc, see also radius
   * @param {Number} [options.yradius=0] - Y radius of arc, see also radius
   * @param {Number} [options.xaxisrotation=0] -  rotation (in degrees) of the X axis of the arc with respect to the X axis of the coordinate system
   * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
   * @param {Boolean} [options.clockwise=false] - draw an arc clockwise with respect to the center point
   * @param {Boolean} [options.large=false] - draw an arc longer than 180 degrees
   * @returns {Path2D} new Path2D object (not closed)
   *
   * @example
   * let p1 = new CSG.Path2D([[27.5,-22.96875]],false);
   * p1 = p1.appendPoint([27.5,-3.28125]);
   * p1 = p1.appendArc([12.5,-22.96875],{xradius: 15,yradius: -19.6875,xaxisrotation: 0,clockwise: false,large: false});
   * p1 = p1.close();
   */
  appendArc(inEndpoint: TVector2Universal, options: any) {
    const decimals = 100000;
    if (arguments.length < 2) {
      options = {};
    }
    if (this.closed) {
      throw new Error('Path must not be closed');
    }
    if (this.points.length < 1) {
      throw new Error('appendArc: path must already contain a point (the endpoint of the path is used as the starting point for the arc)');
    }
    let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D);
    if (resolution < 4) resolution = 4;
    let xradius;
    let yradius;
    if (('xradius' in options) || ('yradius' in options)) {
      if ('radius' in options) {
        throw new Error('Should either give an xradius and yradius parameter, or a radius parameter');
      }
      xradius = parseOptionAsFloat(options, 'xradius', 0);
      yradius = parseOptionAsFloat(options, 'yradius', 0);
    } else {
      xradius = parseOptionAsFloat(options, 'radius', 0);
      yradius = xradius;
    }
    const xaxisrotation = parseOptionAsFloat(options, 'xaxisrotation', 0);
    const clockwise = parseOptionAsBool(options, 'clockwise', false);
    const largearc = parseOptionAsBool(options, 'large', false);
    const startpoint = this.points[this.points.length - 1];
    let endpoint = new Vector2(inEndpoint);
    // round to precision in order to have determinate calculations
    xradius = Math.round(xradius * decimals) / decimals;
    yradius = Math.round(yradius * decimals) / decimals;
    endpoint = new Vector2(Math.round(endpoint.x * decimals) / decimals, Math.round(endpoint.y * decimals) / decimals);

    const sweepFlag = !clockwise;
    let newpoints = [];
    if ((xradius === 0) || (yradius === 0)) {
      // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes:
      // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop
      newpoints.push(endpoint);
    } else {
      xradius = Math.abs(xradius);
      yradius = Math.abs(yradius);

      // see http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes :
      const phi = xaxisrotation * Math.PI / 180.0;
      const cosphi = Math.cos(phi);
      const sinphi = Math.sin(phi);
      const minushalfdistance = startpoint.minus(endpoint).times(0.5);
      // F.6.5.1:
      // round to precision in order to have determinate calculations
      const x = Math.round((cosphi * minushalfdistance.x + sinphi * minushalfdistance.y) * decimals) / decimals;
      const y = Math.round((-sinphi * minushalfdistance.x + cosphi * minushalfdistance.y) * decimals) / decimals;
      const startTranslated = new Vector2(x, y);
      // F.6.6.2:
      const biglambda = (startTranslated.x * startTranslated.x) / (xradius * xradius) + (startTranslated.y * startTranslated.y) / (yradius * yradius);
      if (biglambda > 1.0) {
        // F.6.6.3:
        const sqrtbiglambda = Math.sqrt(biglambda);
        xradius *= sqrtbiglambda;
        yradius *= sqrtbiglambda;
        // round to precision in order to have determinate calculations
        xradius = Math.round(xradius * decimals) / decimals;
        yradius = Math.round(yradius * decimals) / decimals;
      }
      // F.6.5.2:
      let multiplier1 = Math.sqrt((xradius * xradius * yradius * yradius - xradius * xradius * startTranslated.y * startTranslated.y - yradius * yradius * startTranslated.x * startTranslated.x) / (xradius * xradius * startTranslated.y * startTranslated.y + yradius * yradius * startTranslated.x * startTranslated.x));
      if (sweepFlag === largearc) multiplier1 = -multiplier1;
      const centerTranslated = new Vector2(xradius * startTranslated.y / yradius, -yradius * startTranslated.x / xradius).times(multiplier1);
      // F.6.5.3:
      const center = new Vector2(cosphi * centerTranslated.x - sinphi * centerTranslated.y, sinphi * centerTranslated.x + cosphi * centerTranslated.y).plus((startpoint.plus(endpoint)).times(0.5));
      // F.6.5.5:
      const vec1 = new Vector2((startTranslated.x - centerTranslated.x) / xradius, (startTranslated.y - centerTranslated.y) / yradius);
      const vec2 = new Vector2((-startTranslated.x - centerTranslated.x) / xradius, (-startTranslated.y - centerTranslated.y) / yradius);
      const theta1 = vec1.angleRadians();
      const theta2 = vec2.angleRadians();
      let deltatheta = theta2 - theta1;
      deltatheta = deltatheta % (2 * Math.PI);
      if ((!sweepFlag) && (deltatheta > 0)) {
        deltatheta -= 2 * Math.PI;
      } else if ((sweepFlag) && (deltatheta < 0)) {
        deltatheta += 2 * Math.PI;
      }

      // Ok, we have the center point and angle range (from theta1, deltatheta radians) so we can create the ellipse
      let numsteps = Math.ceil(Math.abs(deltatheta) / (2 * Math.PI) * resolution) + 1;
      if (numsteps < 1) numsteps = 1;
      for (let step = 1; step <= numsteps; step++) {
        const theta = theta1 + step / numsteps * deltatheta;
        const costheta = Math.cos(theta);
        const sintheta = Math.sin(theta);
        // F.6.3.1:
        const point = new Vector2(cosphi * xradius * costheta - sinphi * yradius * sintheta, sinphi * xradius * costheta + cosphi * yradius * sintheta).plus(center);
        newpoints.push(point);
      }
    }
    newpoints = this.points.concat(newpoints);
    const result = new Path2D(newpoints);
    return result;
  }
}

