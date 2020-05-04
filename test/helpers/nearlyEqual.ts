// Compare two numeric values for near equality.
// the given test is fails if the numeric values are outside the given epsilon
export function nearlyEqual(t: any, a: any, b: any, epsilon: any, failMessage?: any) {
  if (a === b) { // shortcut, also handles infinities and NaNs
    return true;
  }

  const absA = Math.abs(a);
  const absB = Math.abs(b);
  const diff = Math.abs(a - b);
  if (a === 0 || b === 0 || diff < Number.EPSILON) {
    // a or b is zero or both are extremely close to it
    // relative error is less meaningful here
    if (diff > (epsilon * Number.EPSILON)) {
      failMessage = failMessage === undefined ? 'near zero Numbers outside of epsilon' : failMessage;
      t.fail(failMessage + '(' + a + ',' + b + ')');
    }
  }
  // use relative error
  if ((diff / Math.min((absA + absB), Number.MAX_VALUE)) > epsilon) {
    failMessage = failMessage === undefined ? 'Numbers outside of epsilon' : failMessage;
    t.fail(failMessage + '(' + a + ',' + b + ')');
  }
}