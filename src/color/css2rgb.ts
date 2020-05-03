import {cssColors3ub, TCssColorNames} from './colorTable/cssColors';

/**
 * Converts an CSS color name to RGB color.
 *
 * @param   colorName       The CSS color name
 * @return  Array           The RGB representation, or [0,0,0] default
 */
export function css2rgb(colorName: TCssColorNames | string) {
  const [r, g, b] = cssColors3ub[colorName.toLowerCase() as TCssColorNames];
  return [r / 255, g / 255, b / 255];
}
