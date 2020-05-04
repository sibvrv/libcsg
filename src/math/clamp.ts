/**
 * Clamp
 * @param value
 * @param min
 * @param max
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
