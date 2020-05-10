/**
 * Number sort
 * @param a
 * @param b
 */
export function fnNumberSort(a: number, b: number) {
  return a - b;
}

/**
 * Sort objects by index
 * @param a
 * @param b
 */
export function fnSortByIndex<T extends { index: number }>(a: T, b: T) {
  return a.index - b.index;
}
