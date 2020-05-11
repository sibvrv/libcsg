import { IVectorTextOptions } from '@root/text/types/VectorTextTypes';
/**
 * Construct an array of character segments from a ascii string whose characters code is between 31 and 127,
 * if one character is not supported it is replaced by a question mark.
 * @param {Object|String} [options] - options for construction or ascii string
 * @param {number} [options.xOffset=0] - x offset
 * @param {number} [options.yOffset=0] - y offset
 * @param {number} [options.height=21] - font size (uppercase height)
 * @param {number} [options.lineSpacing=1.4] - line spacing expressed as a percentage of font size
 * @param {number} [options.letterSpacing=1] - extra letter spacing expressed as a percentage of font size
 * @param {String} [options.align='left'] - multi-line text alignement: left, center or right
 * @param {number} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character
 * @param {String} [options.input='?'] - ascii string (ignored/overwrited if provided as seconds parameter)
 * @param {String} [text='?'] - ascii string
 * @returns {Array} characters segments [[[x, y], ...], ...]
 *
 * @example
 * let textSegments = vectorText()
 * or
 * let textSegments = vectorText('OpenJSCAD')
 * or
 * let textSegments = vectorText({ yOffset: -50 }, 'OpenJSCAD')
 * or
 * let textSegments = vectorText({ yOffset: -80, input: 'OpenJSCAD' })
 */
export declare function vectorText(options?: Partial<IVectorTextOptions> | string, text?: string): any[];
//# sourceMappingURL=vectorText.d.ts.map