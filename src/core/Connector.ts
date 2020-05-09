import {Line3D, Matrix4x4, OrthoNormalBasis, Plane, TransformationMethods, TVector3Universal, Vector3} from './math';

// # class Connector
// A connector allows to attach two objects at predefined positions
// For example a servo motor and a servo horn:
// Both can have a Connector called 'shaft'
// The horn can be moved and rotated such that the two connectors match
// and the horn is attached to the servo motor at the proper position.
// Connectors are stored in the properties of a CSG solid so they are
// ge the same transformations applied as the solid
export class Connector extends TransformationMethods {
  point: Vector3;
  axisvector: Vector3;
  normalvector: Vector3;

  /**
   * Connector Constructor
   */
  constructor(point: TVector3Universal, axisvector: TVector3Universal, normalvector: TVector3Universal) {
    super();
    this.point = new Vector3(point);
    this.axisvector = new Vector3(axisvector).unit();
    this.normalvector = new Vector3(normalvector).unit();
  }

  normalized() {
    const axisvector = this.axisvector.unit();
    // make the normal vector truly normal:
    const n = this.normalvector.cross(axisvector).unit();
    const normalvector = axisvector.cross(n);
    return new Connector(this.point, axisvector, normalvector);
  }

  transform(matrix4x4: Matrix4x4): Connector {
    const point = this.point.multiply4x4(matrix4x4);
    const axisvector = this.point.plus(this.axisvector).multiply4x4(matrix4x4).minus(point);
    const normalvector = this.point.plus(this.normalvector).multiply4x4(matrix4x4).minus(point);
    return new Connector(point, axisvector, normalvector);
  }

  // Get the transformation matrix to connect this Connector to another connector
  //   other: a Connector to which this connector should be connected
  //   mirror: false: the 'axis' vectors of the connectors should point in the same direction
  //           true: the 'axis' vectors of the connectors should point in opposite direction
  //   normalrotation: degrees of rotation between the 'normal' vectors of the two
  //                   connectors
  getTransformationTo(other: Connector, mirror: boolean, normalrotation: number) {
    mirror = mirror ? true : false;
    normalrotation = normalrotation ? Number(normalrotation) : 0;
    const us = this.normalized();
    other = other.normalized();
    // shift to the origin:
    let transformation = Matrix4x4.translation(this.point.negated());
    // construct the plane crossing through the origin and the two axes:
    const axesplane = Plane.anyPlaneFromVector3Ds(
      new Vector3(0, 0, 0), us.axisvector, other.axisvector);
    const axesbasis = new OrthoNormalBasis(axesplane);
    let angle1 = axesbasis.to2D(us.axisvector).angle();
    let angle2 = axesbasis.to2D(other.axisvector).angle();
    let rotation = 180.0 * (angle2 - angle1) / Math.PI;
    if (mirror) rotation += 180.0;
    transformation = transformation.multiply(axesbasis.getProjectionMatrix());
    transformation = transformation.multiply(Matrix4x4.rotationZ(rotation));
    transformation = transformation.multiply(axesbasis.getInverseProjectionMatrix());
    const usAxesAligned = us.transform(transformation);
    // Now we have done the transformation for aligning the axes.
    // We still need to align the normals:
    const normalsplane = Plane.fromNormalAndPoint(other.axisvector, new Vector3(0, 0, 0));
    const normalsbasis = new OrthoNormalBasis(normalsplane);
    angle1 = normalsbasis.to2D(usAxesAligned.normalvector).angle();
    angle2 = normalsbasis.to2D(other.normalvector).angle();
    rotation = 180.0 * (angle2 - angle1) / Math.PI;
    rotation += normalrotation;
    transformation = transformation.multiply(normalsbasis.getProjectionMatrix());
    transformation = transformation.multiply(Matrix4x4.rotationZ(rotation));
    transformation = transformation.multiply(normalsbasis.getInverseProjectionMatrix());
    // and translate to the destination point:
    transformation = transformation.multiply(Matrix4x4.translation(other.point));
    // let usAligned = us.transform(transformation);
    return transformation;
  }

  axisLine() {
    return new Line3D(this.point, this.axisvector);
  }

  // creates a new Connector, with the connection point moved in the direction of the axisvector
  extend(distance: number) {
    const newpoint = this.point.plus(this.axisvector.unit().times(distance));
    return new Connector(newpoint, this.axisvector, this.normalvector);
  }
}
