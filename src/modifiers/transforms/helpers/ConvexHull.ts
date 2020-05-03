import {ConvexHullPoint} from './ConvexHullPoint';

/**
 * Convex Hull
 * from http://www.psychedelicdevelopment.com/grahamscan/
 * see also at https://github.com/bkiers/GrahamScan/blob/master/src/main/cg/GrahamScan.java
 */
export class ConvexHull {
  points: any[] = null!;
  indices: number[] = null!;

  getIndices() {
    return this.indices;
  };

  clear() {
    this.indices = null!;
    this.points = null!;
  }

  ccw(p1: number, p2: number, p3: number) {
    const ccw = (this.points[p2].x - this.points[p1].x) * (this.points[p3].y - this.points[p1].y) -
      (this.points[p2].y - this.points[p1].y) * (this.points[p3].x - this.points[p1].x);
    // we need this, otherwise sorting never ends, see https://github.com/Spiritdude/OpenJSCAD.org/issues/18
    if (ccw < 1e-5) {
      return 0;
    }
    return ccw;
  }

  angle(o: number, a: number) {
    // return Math.atan((this.points[a].y-this.points[o].y) / (this.points[a].x - this.points[o].x));
    return Math.atan2((this.points[a].y - this.points[o].y), (this.points[a].x - this.points[o].x));
  }

  distance(a: number, b: number) {
    return ((this.points[b].x - this.points[a].x) * (this.points[b].x - this.points[a].x) +
      (this.points[b].y - this.points[a].y) * (this.points[b].y - this.points[a].y));
  };

  compute(_points: any[]) {
    this.indices = null!;
    if (_points.length < 3) {
      return;
    }
    this.points = _points;

    // Find the lowest point
    let min = 0;
    for (let i = 1; i < this.points.length; i++) {
      if (this.points[i].y === this.points[min].y) {
        if (this.points[i].x < this.points[min].x) {
          min = i;
        }
      } else if (this.points[i].y < this.points[min].y) {
        min = i;
      }
    }

    // Calculate angle and distance from base
    const al: ConvexHullPoint[] = [];
    let ang = 0.0;
    let dist = 0.0;
    for (let i = 0; i < this.points.length; i++) {
      if (i === min) {
        continue;
      }
      ang = this.angle(min, i);
      if (ang < 0) {
        ang += Math.PI;
      }
      dist = this.distance(min, i);
      al.push(new ConvexHullPoint(i, ang, dist));
    }

    al.sort((a, b) => {
      return a.compare(b);
    });

    // Create stack
    const stack = new Array(this.points.length + 1);
    let j = 2;
    for (let i = 0; i < this.points.length; i++) {
      if (i === min) {
        continue;
      }
      stack[j] = al[j - 2].index;
      j++;
    }
    stack[0] = stack[this.points.length];
    stack[1] = min;

    let tmp;
    let M = 2;
    for (let i = 3; i <= this.points.length; i++) {
      while (this.ccw(stack[M - 1], stack[M], stack[i]) <= 0) {
        M--;
      }
      M++;
      tmp = stack[i];
      stack[i] = stack[M];
      stack[M] = tmp;
    }

    this.indices = new Array(M);
    for (let i = 0; i < M; i++) {
      this.indices[i] = stack[i + 1];
    }
  };
}
