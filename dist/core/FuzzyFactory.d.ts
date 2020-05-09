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
export declare class FuzzyFactory {
    lookuptable: any;
    multiplier: number;
    /**
     * Fuzzy Constructor
     */
    constructor(numdimensions: number, tolerance: number);
    /**
     * let obj = f.lookupOrCreate([el1, el2, el3], function(elements) { ... create the new object ... });
     * Performs a fuzzy lookup of the object with the specified elements.
     * If found, returns the existing object
     * If not found, calls the supplied callback function which should create a new object with
     * the specified properties. This object is inserted in the lookup database.
     * @param els
     * @param creatorCallback
     */
    lookupOrCreate(els: number[], creatorCallback: (els: number[]) => any): any;
}
//# sourceMappingURL=FuzzyFactory.d.ts.map