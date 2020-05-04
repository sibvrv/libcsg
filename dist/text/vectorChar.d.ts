import { IVectorTextOptions } from './vectorParams';
/**
 * Represents a character as segments
 * @typedef {Object} VectorCharObject
 * @property {number} width - character width
 * @property {number} height - character height (uppercase)
 * @property {Array} segments - character segments [[[x, y], ...], ...]
 */
/**
 * Construct a {@link VectorCharObject} from a ascii character whose code is between 31 and 127,
 * if the character is not supported it is replaced by a question mark.
 * @param {Object|String} [options] - options for construction or ascii character
 * @param {Float} [options.xOffset=0] - x offset
 * @param {Float} [options.yOffset=0] - y offset
 * @param {Float} [options.height=21] - font size (uppercase height)
 * @param {Float} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character
 * @param {String} [options.input='?'] - ascii character (ignored/overwrited if provided as seconds parameter)
 * @param {String} [char='?'] - ascii character
 * @returns {VectorCharObject}
 *
 * @example
 * let vectorCharObject = vectorChar()
 * or
 * let vectorCharObject = vectorChar('A')
 * or
 * let vectorCharObject = vectorChar({ xOffset: 57 }, 'C')
 * or
 * let vectorCharObject = vectorChar({ xOffset: 78, input: '!' })
 */
export declare function vectorChar(options?: Partial<IVectorTextOptions>, char?: string): {
    width: number;
    height: number;
    segments: number[][][];
};
//# sourceMappingURL=vectorChar.d.ts.map