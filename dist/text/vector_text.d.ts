/**
 * Construct an array of character segments from a ascii string whose characters code is between 31 and 127,
 * if one character is not supported it is replaced by a question mark.
 * @param {number} x - x offset
 * @param {number} y - y offset
 * @param {string} text - ascii string
 * @returns {Array} characters segments [[[x, y], ...], ...]
 * @deprecated >= v2
 *
 * @example
 * let textSegments = vector_text(0, -20, 'OpenJSCAD')
 */
export declare function vector_text(x: number, y: number, text: string): any[];
//# sourceMappingURL=vector_text.d.ts.map