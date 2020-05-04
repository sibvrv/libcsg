export declare function vertex3Equals(t: any, observed: any, expected: any): any;
export declare function vertex2Equals(t: any, observed: any, expected: any, failMessage?: string): any;
export declare function vector3Equals(t: any, observed: any, expected: any): any;
export declare function sideEquals(t: any, observed: any, expected: any): void;
export declare function shape2dToNestedArray(shape2d: any): any;
export declare function shape3dToNestedArray(shape3d: any): any;
export declare function simplifiedPolygon(polygon: any): {
    positions: any;
    plane: {
        normal: any[];
        w: any;
    };
    shared: any;
};
export declare function simplifiedCSG(csg: any): any;
export declare function almostEquals(t: any, observed: any, expected: any, precision: any): void;
export declare function compareNumbers(a: any, b: any, precision: any): boolean;
export declare function compareVertices(a: any, b: any, precision: any): boolean;
export declare function comparePolygons(a: any, b: any, precision: any): boolean;
//# sourceMappingURL=test-helpers.d.ts.map