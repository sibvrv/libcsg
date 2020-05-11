import {Line2D, Line3D, Matrix4x4, Plane, TransformationMethods, TVector3Universal, Vector2, Vector3} from '.';

/**
 * Reprojects points on a 3D plane onto a 2D plane
 * or from a 2D plane back onto the 3D plane
 * @param  {Plane} plane
 * @param  {Vector3D|Vector2D} rightvector
 *
 * @class OrthoNormalBasis
 */
export class OrthoNormalBasis extends TransformationMethods {
  v: Vector3;
  u: Vector3;
  plane: Plane;
  planeorigin: Vector3;

  /**
   * Get an orthonormal basis for the standard XYZ planes.
   * Parameters: the names of two 3D axes. The 2d x axis will map to the first given 3D axis, the 2d y
   * axis will map to the second.
   *
   * Prepend the axis with a "-" to invert the direction of this axis.
   * For example: OrthoNormalBasis.GetCartesian("-Y","Z")
   * will return an orthonormal basis where the 2d X axis maps to the 3D inverted Y axis, and
   * the 2d Y axis maps to the 3D Z axis.
   * @param xaxisid
   * @param yaxisid
   * @constructor
   */
  static GetCartesian(xaxisid: string, yaxisid: string) {
    const axisid = `${xaxisid}/${yaxisid}`;
    let planenormal;
    let rightvector;
    if (axisid === 'X/Y') {
      planenormal = [0, 0, 1];
      rightvector = [1, 0, 0];
    } else if (axisid === 'Y/-X') {
      planenormal = [0, 0, 1];
      rightvector = [0, 1, 0];
    } else if (axisid === '-X/-Y') {
      planenormal = [0, 0, 1];
      rightvector = [-1, 0, 0];
    } else if (axisid === '-Y/X') {
      planenormal = [0, 0, 1];
      rightvector = [0, -1, 0];
    } else if (axisid === '-X/Y') {
      planenormal = [0, 0, -1];
      rightvector = [-1, 0, 0];
    } else if (axisid === '-Y/-X') {
      planenormal = [0, 0, -1];
      rightvector = [0, -1, 0];
    } else if (axisid === 'X/-Y') {
      planenormal = [0, 0, -1];
      rightvector = [1, 0, 0];
    } else if (axisid === 'Y/X') {
      planenormal = [0, 0, -1];
      rightvector = [0, 1, 0];
    } else if (axisid === 'X/Z') {
      planenormal = [0, -1, 0];
      rightvector = [1, 0, 0];
    } else if (axisid === 'Z/-X') {
      planenormal = [0, -1, 0];
      rightvector = [0, 0, 1];
    } else if (axisid === '-X/-Z') {
      planenormal = [0, -1, 0];
      rightvector = [-1, 0, 0];
    } else if (axisid === '-Z/X') {
      planenormal = [0, -1, 0];
      rightvector = [0, 0, -1];
    } else if (axisid === '-X/Z') {
      planenormal = [0, 1, 0];
      rightvector = [-1, 0, 0];
    } else if (axisid === '-Z/-X') {
      planenormal = [0, 1, 0];
      rightvector = [0, 0, -1];
    } else if (axisid === 'X/-Z') {
      planenormal = [0, 1, 0];
      rightvector = [1, 0, 0];
    } else if (axisid === 'Z/X') {
      planenormal = [0, 1, 0];
      rightvector = [0, 0, 1];
    } else if (axisid === 'Y/Z') {
      planenormal = [1, 0, 0];
      rightvector = [0, 1, 0];
    } else if (axisid === 'Z/-Y') {
      planenormal = [1, 0, 0];
      rightvector = [0, 0, 1];
    } else if (axisid === '-Y/-Z') {
      planenormal = [1, 0, 0];
      rightvector = [0, -1, 0];
    } else if (axisid === '-Z/Y') {
      planenormal = [1, 0, 0];
      rightvector = [0, 0, -1];
    } else if (axisid === '-Y/Z') {
      planenormal = [-1, 0, 0];
      rightvector = [0, -1, 0];
    } else if (axisid === '-Z/-Y') {
      planenormal = [-1, 0, 0];
      rightvector = [0, 0, -1];
    } else if (axisid === 'Y/-Z') {
      planenormal = [-1, 0, 0];
      rightvector = [0, 1, 0];
    } else if (axisid === 'Z/Y') {
      planenormal = [-1, 0, 0];
      rightvector = [0, 0, 1];
    } else {
      throw new Error('OrthoNormalBasis.GetCartesian: invalid combination of axis identifiers. Should pass two string arguments from [X,Y,Z,-X,-Y,-Z], being two different axes.');
    }
    return new OrthoNormalBasis(new Plane(new Vector3(planenormal), 0), new Vector3(rightvector));
  };

  /*
  // test code for OrthoNormalBasis.GetCartesian()
  OrthoNormalBasis.GetCartesian_Test=function() {
    let axisnames=["X","Y","Z","-X","-Y","-Z"];
    let axisvectors=[[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]];
    for(let axis1=0; axis1 < 3; axis1++) {
      for(let axis1inverted=0; axis1inverted < 2; axis1inverted++) {
        let axis1name=axisnames[axis1+3*axis1inverted];
        let axis1vector=axisvectors[axis1+3*axis1inverted];
        for(let axis2=0; axis2 < 3; axis2++) {
          if(axis2 != axis1) {
            for(let axis2inverted=0; axis2inverted < 2; axis2inverted++) {
              let axis2name=axisnames[axis2+3*axis2inverted];
              let axis2vector=axisvectors[axis2+3*axis2inverted];
              let orthobasis=OrthoNormalBasis.GetCartesian(axis1name, axis2name);
              let test1=orthobasis.to3D(new Vector2D([1,0]));
              let test2=orthobasis.to3D(new Vector2D([0,1]));
              let expected1=new Vector3D(axis1vector);
              let expected2=new Vector3D(axis2vector);
              let d1=test1.distanceTo(expected1);
              let d2=test2.distanceTo(expected2);
              if( (d1 > 0.01) || (d2 > 0.01) ) {
                throw new Error("Wrong!");
    }}}}}}
    throw new Error("OK");
  };
  */

  /**
   * The z=0 plane, with the 3D x and y vectors mapped to the 2D x and y vector
   * @constructor
   */
  static Z0Plane() {
    const plane = new Plane(new Vector3([0, 0, 1]), 0);
    return new OrthoNormalBasis(plane, new Vector3([1, 0, 0]));
  };

  /**
   * OrthoNormalBasis Constructor
   */
  constructor(plane: Plane, _rightvector?: TVector3Universal) {
    super();
    const rightvector = typeof _rightvector !== 'undefined' ? new Vector3(_rightvector) : plane.normal.randomNonParallelVector();

    this.v = plane.normal.cross(rightvector).unit();
    this.u = this.v.cross(plane.normal);
    this.plane = plane;
    this.planeorigin = plane.normal.times(plane.w);
  }

  /**
   * Get projection matrix
   */
  getProjectionMatrix() {
    return new Matrix4x4([
      this.u.x, this.v.x, this.plane.normal.x, 0,
      this.u.y, this.v.y, this.plane.normal.y, 0,
      this.u.z, this.v.z, this.plane.normal.z, 0,
      0, 0, -this.plane.w, 1,
    ]);
  }

  /**
   * Get inverse projection matrix
   */
  getInverseProjectionMatrix() {
    const p = this.plane.normal.times(this.plane.w);
    return new Matrix4x4([
      this.u.x, this.u.y, this.u.z, 0,
      this.v.x, this.v.y, this.v.z, 0,
      this.plane.normal.x, this.plane.normal.y, this.plane.normal.z, 0,
      p.x, p.y, p.z, 1,
    ]);
  }

  /**
   * to Vector2
   * @param vec3
   */
  to2D(vec3: Vector3) {
    return new Vector2(vec3.dot(this.u), vec3.dot(this.v));
  }

  /**
   * to Vector3
   * @param vec2
   */
  to3D(vec2: Vector2) {
    return this.planeorigin.plus(this.u.times(vec2.x)).plus(this.v.times(vec2.y));
  }

  /**
   * Line 3D to 2D
   * @param line3d
   */
  line3Dto2D(line3d: Line3D) {
    const a = line3d.point;
    const b = line3d.direction.plus(a);
    const a2d = this.to2D(a);
    const b2d = this.to2D(b);
    return Line2D.fromPoints(a2d, b2d);
  }

  /**
   * Line 2D to 3D
   * @param line2d
   */
  line2Dto3D(line2d: Line2D) {
    const a = line2d.origin();
    const b = line2d.direction().plus(a);
    const a3d = this.to3D(a);
    const b3d = this.to3D(b);
    return Line3D.fromPoints(a3d, b3d);
  }

  /**
   * Transform helper
   * @param matrix4x4
   */
  transform(matrix4x4: Matrix4x4): OrthoNormalBasis {
    // todo: this may not work properly in case of mirroring
    const newplane = this.plane.transform(matrix4x4);
    const rightpointTransformed = this.u.transform(matrix4x4);
    const originTransformed = new Vector3(0, 0, 0).transform(matrix4x4);
    const newrighthandvector = rightpointTransformed.minus(originTransformed);
    const newbasis = new OrthoNormalBasis(newplane, newrighthandvector);
    return newbasis;
  }
}

