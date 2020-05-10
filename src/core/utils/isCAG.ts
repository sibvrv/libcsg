/**
 * Is CAG object
 * @param object
 */
export function isCAG(object: any) {
  // objects[i] instanceof CAG => NOT RELIABLE
  // 'instanceof' causes huge issues when using objects from
  // two different versions of CSG.js as they are not reckonized as one and the same
  // so DO NOT use instanceof to detect matching types for CSG/CAG
  if (!('sides' in object)) {
    return false;
  }

  if (!('length' in object.sides)) {
    return false;
  }

  return true;
}
