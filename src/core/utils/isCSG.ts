/**
 * Is CSG object
 * @param object
 */
export function isCSG(object: any) {
  // objects[i] instanceof CSG => NOT RELIABLE
  // 'instanceof' causes huge issues when using objects from
  // two different versions of CSG.js as they are not reckonized as one and the same
  // so DO NOT use instanceof to detect matching types for CSG/CAG
  if (!('polygons' in object)) {
    return false;
  }

  if (!('length' in object.polygons)) {
    return false;
  }

  return true;
}
