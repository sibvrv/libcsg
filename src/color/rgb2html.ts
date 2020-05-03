/**
 * Converts RGB color value to HTML5 color value (string)
 * Conversion forumla:
 * - convert R, G, B into HEX strings
 * - return HTML formatted string "#RRGGBB"
 */
export function rgb2html(r: number | number[], g: number, b: number) {
  if (Array.isArray(r)) {
    b = r[2];
    g = r[1];
    r = r[0];
  }

  const s = '#' +
    Number(0x1000000 + r * 255 * 0x10000 + g * 255 * 0x100 + b * 255).toString(16).substring(1, 7);
  return s;
}
