import {Matrix4x4} from './math/Matrix4';
import Vector3D from './math/Vector3';
import Plane from './math/Plane';

// Add several convenience methods to the classes that support a transform() method:
export const addTransformationMethodsToPrototype = (prot: any) => {
  prot.mirrored = function(plane: any) {
    return this.transform(Matrix4x4.mirroring(plane));
  };

  prot.mirroredX = function() {
    const plane = new Plane(Vector3D.Create(1, 0, 0), 0);
    return this.mirrored(plane);
  };

  prot.mirroredY = function() {
    const plane = new Plane(Vector3D.Create(0, 1, 0), 0);
    return this.mirrored(plane);
  };

  prot.mirroredZ = function() {
    const plane = new Plane(Vector3D.Create(0, 0, 1), 0);
    return this.mirrored(plane);
  };

  prot.translate = function(v: any) {
    return this.transform(Matrix4x4.translation(v));
  };

  prot.scale = function(f: number) {
    return this.transform(Matrix4x4.scaling(f));
  };

  prot.rotateX = function(deg: number) {
    return this.transform(Matrix4x4.rotationX(deg));
  };

  prot.rotateY = function(deg: number) {
    return this.transform(Matrix4x4.rotationY(deg));
  };

  prot.rotateZ = function(deg: number) {
    return this.transform(Matrix4x4.rotationZ(deg));
  };

  prot.rotate = function(rotationCenter: any, rotationAxis: any, degrees: number) {
    return this.transform(Matrix4x4.rotation(rotationCenter, rotationAxis, degrees));
  };

  prot.rotateEulerAngles = function(alpha: number, beta: number, gamma: number, position: any) {
    position = position || [0, 0, 0];

    const Rz1 = Matrix4x4.rotationZ(alpha);
    const Rx = Matrix4x4.rotationX(beta);
    const Rz2 = Matrix4x4.rotationZ(gamma);
    const T = Matrix4x4.translation(new Vector3D(position));

    return this.transform(Rz2.multiply(Rx).multiply(Rz1).multiply(T));
  };

  prot.rotateEulerXYZ = function(alpha: number, beta: number, gamma: number, position: any) {
    position = position || [0, 0, 0];

    const Rx = Matrix4x4.rotationX(alpha);
    const Ry = Matrix4x4.rotationY(beta);
    const Rz = Matrix4x4.rotationZ(gamma);
    const T = Matrix4x4.translation(new Vector3D(position));

    return this.transform(Rz.multiply(Ry).multiply(Rx).multiply(T));
  };
};

// TODO: consider generalization and adding to addTransformationMethodsToPrototype
export const addCenteringToPrototype = (prot: any, axes: any) => {
  prot.center = function(cAxes: any) {
    cAxes = Array.prototype.map.call(arguments, (a) => {
      return a; // .toLowerCase();
    });
    // no args: center on all axes
    if (!cAxes.length) {
      cAxes = axes.slice();
    }
    const b = this.getBounds();
    return this.translate(axes.map((a: any) => cAxes.indexOf(a) > -1 ? -(b[0][a] + b[1][a]) / 2 : 0));
  };
};
