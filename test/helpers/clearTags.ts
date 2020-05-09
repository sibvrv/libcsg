/**
 * Helper function to remove the very variable 'tags' fields from a CAG object
 * @param  {CAG} input CAG
 * @returns {CAG} the MUTATED CAG
 */
export const clearTags = (inputCAG: any) => {
  inputCAG.sides = inputCAG.sides.map((side: any) => {
    delete side.vertex0.tag;
    delete side.vertex1.tag;
    return side;
  });
  return inputCAG;
};
