/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  v       The value
 * @return  Array           The RGB representation
 */
export declare function hsv2rgb(h: number | number[], s: number, v: number): (number | undefined)[];
//# sourceMappingURL=hsv2rgb.d.ts.map