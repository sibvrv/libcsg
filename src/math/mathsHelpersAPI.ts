const TWO_PI = Math.PI * 2;

// -- Math functions (360 deg based vs 2pi)

export function sin(a: number) {
  return Math.sin(a / 360 * TWO_PI);
}

export function cos(a: number) {
  return Math.cos(a / 360 * TWO_PI);
}

export function asin(a: number) {
  return Math.asin(a) / 360 * TWO_PI;
}

export function acos(a: number) {
  return Math.acos(a) / 360 * TWO_PI;
}

export function tan(a: number) {
  return Math.tan(a / 360 * TWO_PI);
}

export function atan(a: number) {
  return Math.atan(a) / 360 * TWO_PI;
}

export function atan2(a: number, b: number) {
  return Math.atan2(a, b) / 360 * TWO_PI;
}

export function ceil(a: number) {
  return Math.ceil(a);
}

export function floor(a: number) {
  return Math.floor(a);
}

export function abs(a: number) {
  return Math.abs(a);
}

export function min(a: number, b: number) {
  return a < b ? a : b;
}

export function max(a: number, b: number) {
  return a > b ? a : b;
}

export function rands(minValue: number, maxValue: number, vn: number, seed: number) {
  // -- seed is ignored for now, FIX IT (requires reimplementation of random())
  //    see http://stackoverflow.com/questions/424292/how-to-create-my-own-javascript-random-number-generator-that-i-can-also-set-the
  const v = new Array(vn);
  for (let i = 0; i < vn; i++) {
    v[i] = Math.random() * (maxValue - minValue) + minValue;
  }
}

export function log(a: number) {
  return Math.log(a);
}

export function lookup(ix: number, v: number[][]) {
  let r = 0;
  for (let i = 0; i < v.length; i++) {
    let a0 = v[i];
    if (a0[0] >= ix) {
      i--;
      a0 = v[i];
      const a1 = v[i + 1];
      let m = 0;
      if (a0[0] !== a1[0]) {
        m = abs((ix - a0[0]) / (a1[0] - a0[0]));
      }
      // echo(">>",i,ix,a0[0],a1[0],";",m,a0[1],a1[1])
      if (m > 0) {
        r = a0[1] * (1 - m) + a1[1] * m;
      } else {
        r = a0[1];
      }
      return r;
    }
  }
  return r;
}

export function pow(a: number, b: number) {
  return Math.pow(a, b);
}

export function sign(a: number) {
  return a < 0 ? -1 : (a > 1 ? 1 : 0);
}

export function sqrt(a: number) {
  return Math.sqrt(a);
}

export function round(a: number) {
  return floor(a + 0.5);
}
