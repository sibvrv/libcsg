/**
 * Is Float
 * @param n
 * @constructor
 */
export const isFloat = (n: number) => (!isNaN(n)) || (n === Infinity) || (n === -Infinity);
