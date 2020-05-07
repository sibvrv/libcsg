import {Matrix4x4} from './math/Matrix4';

// ////////////////////////////////////
// # Class Properties
// This class is used to store properties of a solid
// A property can for example be a Vertex, a Plane or a Line3D
// Whenever an affine transform is applied to the CSG solid, all its properties are
// transformed as well.
// The properties can be stored in a complex nested structure (using arrays and objects)
export class Properties {
  // todo: replace it with states (setState/getState)
  [key: string] : any;

  static transformObj(source: any, result: any, matrix4x4: Matrix4x4) {
    for (const propertyName in source) {
      if (propertyName === '_transform') continue;
      if (propertyName === '_merge') continue;
      const propertyValue = source[propertyName];
      let transformed = propertyValue;
      if (typeof (propertyValue) === 'object') {
        if (('transform' in propertyValue) && (typeof (propertyValue.transform) === 'function')) {
          transformed = propertyValue.transform(matrix4x4);
        } else if (propertyValue instanceof Array) {
          transformed = [];
          Properties.transformObj(propertyValue, transformed, matrix4x4);
        } else if (propertyValue instanceof Properties) {
          transformed = new Properties();
          Properties.transformObj(propertyValue, transformed, matrix4x4);
        }
      }
      result[propertyName] = transformed;
    }
  }

  static cloneObj(source: any, result: any) {
    for (const propertyName in source) {
      if (propertyName === '_transform') continue;
      if (propertyName === '_merge') continue;
      const propertyValue = source[propertyName];
      let cloned = propertyValue;
      if (typeof (propertyValue) === 'object') {
        if (propertyValue instanceof Array) {
          cloned = [];

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < propertyValue.length; i++) {
            cloned.push(propertyValue[i]);
          }
        } else if (propertyValue instanceof Properties) {
          cloned = new Properties();
          Properties.cloneObj(propertyValue, cloned);
        }
      }
      result[propertyName] = cloned;
    }
  }

  static addFrom(result: any, otherproperties: any) {
    for (const propertyName in otherproperties) {
      if (propertyName === '_transform') continue;
      if (propertyName === '_merge') continue;
      if ((propertyName in result) &&
        (typeof (result[propertyName]) === 'object') &&
        (result[propertyName] instanceof Properties) &&
        (typeof (otherproperties[propertyName]) === 'object') &&
        (otherproperties[propertyName] instanceof Properties)) {
        Properties.addFrom(result[propertyName], otherproperties[propertyName]);
      } else if (!(propertyName in result)) {
        result[propertyName] = otherproperties[propertyName];
      }
    }
  }

  _transform(matrix4x4: Matrix4x4) {
    const result = new Properties();
    Properties.transformObj(this, result, matrix4x4);
    return result;
  }

  _merge(otherproperties: any) {
    const result = new Properties();
    Properties.cloneObj(this, result);
    Properties.addFrom(result, otherproperties);
    return result;
  }
}
