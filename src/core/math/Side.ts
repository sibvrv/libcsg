import {Vector2} from './Vector2';
import {Vertex2} from './Vertex2';
import {Vertex3} from './Vertex3';
import {Polygon3} from './Polygon3';
import {getTag} from '../constants';
import {TransformationMethods} from '../TransformationMethods';
import {Matrix4x4} from './Matrix4';

export class Side extends TransformationMethods {
  vertex0: Vertex2;
  vertex1: Vertex2;
  tag?: number;

  static fromObject(obj: Side) {
    const vertex0 = Vertex2.fromObject(obj.vertex0);
    const vertex1 = Vertex2.fromObject(obj.vertex1);
    return new Side(vertex0, vertex1);
  };

  _fromFakePolygon(polygon: Polygon3) {
    // this can happen based on union, seems to be residuals -
    // return null and handle in caller
    if (polygon.vertices.length < 4) {
      return null;
    }
    const vert1Indices: number[] = [];
    const pts2d = polygon.vertices
      .filter((v, i) => {
        if (v.pos.z > 0) {
          vert1Indices.push(i);
          return true;
        }
        return false;
      })
      .map((v) => {
        return new Vector2(v.pos.x, v.pos.y);
      });

    if (pts2d.length !== 2) {
      throw new Error('Assertion failed: _fromFakePolygon: not enough points found');
    }

    const d = vert1Indices[1] - vert1Indices[0];
    if (d === 1 || d === 3) {
      if (d === 1) {
        pts2d.reverse();
      }
    } else {
      throw new Error('Assertion failed: _fromFakePolygon: unknown index ordering');
    }

    const result = new Side(new Vertex2(pts2d[0]), new Vertex2(pts2d[1]));
    return result;
  };

  constructor(vertex0: Vertex2, vertex1: Vertex2) {
    super();
    this.vertex0 = vertex0;
    this.vertex1 = vertex1;
  }

  toString() {
    return this.vertex0 + ' -> ' + this.vertex1;
  }

  toPolygon3D(z0: number, z1: number) {
    // console.log(this.vertex0.pos)
    const vertices = [
      new Vertex3(this.vertex0.pos.toVector3D(z0)),
      new Vertex3(this.vertex1.pos.toVector3D(z0)),
      new Vertex3(this.vertex1.pos.toVector3D(z1)),
      new Vertex3(this.vertex0.pos.toVector3D(z1)),
    ];
    return new Polygon3(vertices);
  }

  transform(matrix4x4: Matrix4x4) {
    const newp1 = this.vertex0.pos.transform(matrix4x4);
    const newp2 = this.vertex1.pos.transform(matrix4x4);
    return new Side(new Vertex2(newp1), new Vertex2(newp2));
  }

  flipped() {
    return new Side(this.vertex1, this.vertex0);
  }

  direction() {
    return this.vertex1.pos.minus(this.vertex0.pos);
  }

  getTag() {
    let result = this.tag;
    if (!result) {
      result = getTag();
      this.tag = result;
    }
    return result;
  }

  lengthSquared() {
    const x = this.vertex1.pos.x - this.vertex0.pos.x;
    const y = this.vertex1.pos.y - this.vertex0.pos.y;
    return x * x + y * y;
  }

  length() {
    return Math.sqrt(this.lengthSquared());
  }
}
