/**
 * ## class FuzzyFactory
 * This class acts as a factory for objects. We can search for an object with approximately
 * the desired properties (say a rectangle with width 2 and height 1)
 * The lookupOrCreate() method looks for an existing object (for example it may find an existing rectangle
 * with width 2.0001 and height 0.999. If no object is found, the user supplied callback is
 * called, which should generate a new object. The new object is inserted into the database
 * so it can be found by future lookupOrCreate() calls.
 * Constructor:
 * numdimensions: the number of parameters for each object
 * for example for a 2D rectangle this would be 2
 * tolerance: The maximum difference for each parameter allowed to be considered a match
 */
export class FuzzyFactory {
  lookuptable: any = {};
  multiplier = 1;

  /**
   * Fuzzy Constructor
   */
  constructor(numdimensions: number, tolerance: number) {
    this.multiplier = 1.0 / tolerance;
  }

  /**
   * let obj = f.lookupOrCreate([el1, el2, el3], function(elements) { ... create the new object ... });
   * Performs a fuzzy lookup of the object with the specified elements.
   * If found, returns the existing object
   * If not found, calls the supplied callback function which should create a new object with
   * the specified properties. This object is inserted in the lookup database.
   * @param els
   * @param creatorCallback
   */
  lookupOrCreate(els: number[], creatorCallback: (els: number[]) => any) {
    const {multiplier} = this;

    let hash = '';

    els.forEach((el: any) => {
      const valueQuantized = Math.round(el * multiplier);
      hash += valueQuantized + '/';
    });

    if (hash in this.lookuptable) {
      return this.lookuptable[hash];
    } else {
      const object = creatorCallback(els);
      const hashparts = els.map((el: any) => {
        const q0 = Math.floor(el * multiplier);
        const q1 = q0 + 1;
        return ['' + q0 + '/', '' + q1 + '/'];
      });
      const numelements = els.length;
      const numhashes = 1 << numelements;
      for (let hashmask = 0; hashmask < numhashes; ++hashmask) {
        let hashmaskShifted = hashmask;
        hash = '';
        hashparts.forEach((hashpart: any) => {
          hash += hashpart[hashmaskShifted & 1];
          hashmaskShifted >>= 1;
        });
        this.lookuptable[hash] = object;
      }
      return object;
    }
  }
}
