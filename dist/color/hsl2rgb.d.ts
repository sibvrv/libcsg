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
export declare function hsl2rgb(h: number | number[], s: number, l: number): number[];
//# sourceMappingURL=hsl2rgb.d.ts.map