import {Matrix4x4} from './math/Matrix4';
import {Plane} from './math/Plane';
import {TVector3Universal, Vector3} from './math/Vector3';

export abstract class TransformationMethods {
  abstract transform<T = this>(mat: Matrix4x4): any;

  mirrored(plane: Plane) {
    return this.transform(Matrix4x4.mirroring(plane));
  }

  mirroredX() {
    const plane = new Plane(Vector3.Create(1, 0, 0), 0);
    return this.mirrored(plane);
  }

  mirroredY() {
    const plane = new Plane(Vector3.Create(0, 1, 0), 0);
    return this.mirrored(plane);
  }

  mirroredZ() {
    const plane = new Plane(Vector3.Create(0, 0, 1), 0);
    return this.mirrored(plane);
  }

  translate(v: TVector3Universal) {
    return this.transform(Matrix4x4.translation(v));
  }

  scale(f: TVector3Universal) {
    return this.transform(Matrix4x4.scaling(f));
  }

  rotateX(deg: number) {
    return this.transform(Matrix4x4.rotationX(deg));
  }

  rotateY(deg: number) {
    return this.transform(Matrix4x4.rotationY(deg));
  }

  rotateZ(deg: number) {
    return this.transform(Matrix4x4.rotationZ(deg));
  }

  rotate(rotationCenter: any, rotationAxis: any, degrees: number) {
    return this.transform(Matrix4x4.rotation(rotationCenter, rotationAxis, degrees));
  }

  rotateEulerAngles(alpha: number, beta: number, gamma: number, position: TVector3Universal) {
    position = position || [0, 0, 0];

    const Rz1 = Matrix4x4.rotationZ(alpha);
    const Rx = Matrix4x4.rotationX(beta);
    const Rz2 = Matrix4x4.rotationZ(gamma);
    const T = Matrix4x4.translation(new Vector3(position));

    return this.transform(Rz2.multiply(Rx).multiply(Rz1).multiply(T));
  }

  rotateEulerXYZ(alpha: number, beta: number, gamma: number, position: TVector3Universal) {
    position = position || [0, 0, 0];

    const Rx = Matrix4x4.rotationX(alpha);
    const Ry = Matrix4x4.rotationY(beta);
    const Rz = Matrix4x4.rotationZ(gamma);
    const T = Matrix4x4.translation(new Vector3(position));

    return this.transform(Rz.multiply(Ry).multiply(Rx).multiply(T));
  }
}
