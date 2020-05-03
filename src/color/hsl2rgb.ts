import {hue2rgb} from './hue2rgb';

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param  {Number}  h       The hue
 * @param  {Number}  s       The saturation
 * @param  {Number}  l       The lightness
 * @return  Array           The RGB representation
 */
export function hsl2rgb(h: number | number[], s: number, l: number) {
  if (Array.isArray(h)) {
    l = h[2];
    s = h[1];
    h = h[0];
  }
  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
}
