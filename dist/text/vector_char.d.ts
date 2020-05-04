/**
 * Construct a {@link VectorCharObject} from a ascii character whose code is between 31 and 127,
 * if the character is not supported it is replaced by a question mark.
 * @param {number} x - x offset
 * @param {number} y - y offset
 * @param {String} char - ascii character
 * @returns {VectorCharObject}
 * @deprecated >= v2
 * @example
 * let vectorCharObject = vector_char(36, 0, 'B')
 */
export declare function vector_char(x: number, y: number, char: string): {
    width: number;
    height: number;
    segments: number[][][];
};
//# sourceMappingURL=vector_char.d.ts.map