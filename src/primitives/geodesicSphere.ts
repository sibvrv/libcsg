import {polyhedron} from './polyhedron';
const {scale} = require('../modifiers/transforms');

/**
 * Geodesic Sphere
 * @param params
 */
export function geodesicSphere(params: any) {
  const defaults = {
    r: 1,
    fn: 5,
  };

  // tslint:disable-next-line:prefer-const
  let {r, fn} = Object.assign({}, defaults, params);

  const ci = [ // hard-coded data of icosahedron (20 faces, all triangles)
    [0.850651, 0.000000, -0.525731],
    [0.850651, -0.000000, 0.525731],
    [-0.850651, -0.000000, 0.525731],
    [-0.850651, 0.000000, -0.525731],
    [0.000000, -0.525731, 0.850651],
    [0.000000, 0.525731, 0.850651],
    [0.000000, 0.525731, -0.850651],
    [0.000000, -0.525731, -0.850651],
    [-0.525731, -0.850651, -0.000000],
    [0.525731, -0.850651, -0.000000],
    [0.525731, 0.850651, 0.000000],
    [-0.525731, 0.850651, 0.000000]];

  const ti = [[0, 9, 1], [1, 10, 0], [6, 7, 0], [10, 6, 0], [7, 9, 0], [5, 1, 4], [4, 1, 9], [5, 10, 1], [2, 8, 3], [3, 11, 2], [2, 5, 4],
    [4, 8, 2], [2, 11, 5], [3, 7, 6], [6, 11, 3], [8, 7, 3], [9, 8, 4], [11, 10, 5], [10, 11, 6], [8, 9, 7]];

  // tslint:disable-next-line:no-shadowed-variable
  const geodesicSubDivide = (p: any, fn: any, offset: any) => {
    const p1 = p[0];
    const p2 = p[1];
    const p3 = p[2];
    let n = offset;

    // tslint:disable-next-line:no-shadowed-variable
    const c: any = [];

    // tslint:disable-next-line:no-shadowed-variable
    const f: any = [];

    //           p3
    //           /\
    //          /__\     fn = 3
    //      i  /\  /\
    //        /__\/__\       total triangles = 9 (fn*fn)
    //       /\  /\  /\
    //     0/__\/__\/__\
    //    p1 0   j      p2

    for (let i = 0; i < fn; i++) {
      for (let j = 0; j < fn - i; j++) {
        const t0 = i / fn;
        const t1 = (i + 1) / fn;
        const s0 = j / (fn - i);
        const s1 = (j + 1) / (fn - i);
        const s2 = fn - i - 1 ? j / (fn - i - 1) : 1;
        const q = [];

        q[0] = mix3(mix3(p1, p2, s0), p3, t0);
        q[1] = mix3(mix3(p1, p2, s1), p3, t0);
        q[2] = mix3(mix3(p1, p2, s2), p3, t1);

        // -- normalize
        for (let k = 0; k < 3; k++) {
          const rv = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2]);
          for (let l = 0; l < 3; l++) {
            q[k][l] /= rv;
          }
        }
        c.push(q[0], q[1], q[2]);
        f.push([n, n + 1, n + 2]);
        n += 3;

        if (j < fn - i - 1) {
          const s3 = fn - i - 1 ? (j + 1) / (fn - i - 1) : 1;
          q[0] = mix3(mix3(p1, p2, s1), p3, t0);
          q[1] = mix3(mix3(p1, p2, s3), p3, t1);
          q[2] = mix3(mix3(p1, p2, s2), p3, t1);

          // -- normalize
          for (let k = 0; k < 3; k++) {
            const rv = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2]);
            for (let l = 0; l < 3; l++) {
              q[k][l] /= rv;
            }
          }
          c.push(q[0], q[1], q[2]);
          f.push([n, n + 1, n + 2]);
          n += 3;
        }
      }
    }
    return {points: c, triangles: f, offset: n};
  };

  const mix3 = (a: any, b: any, fv: any) => {
    const _f = 1 - fv;
    const cv: any = [];
    for (let i = 0; i < 3; i++) {
      cv[i] = a[i] * _f + b[i] * fv;
    }
    return cv;
  };

  if (params) {
    if (params.fn) fn = Math.floor(params.fn / 6);
  }

  if (fn <= 0) fn = 1;

  let c: any[] = [];
  let f: any[] = [];
  let offset = 0;

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < ti.length; i++) {
    const g = geodesicSubDivide([ci[ti[i][0]], ci[ti[i][1]], ci[ti[i][2]]], fn, offset);
    c = c.concat(g.points);
    f = f.concat(g.triangles);
    offset = g.offset;
  }
  return scale(r, polyhedron({points: c, triangles: f}));
}
