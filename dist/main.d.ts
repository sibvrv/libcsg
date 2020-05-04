import { circle, cube, cylinder, geodesicSphere, polygon, polyhedron, sphere, square, torus, triangle } from './primitives';
export * as color from './color';
export declare const primitives2d: {
    circle: typeof circle;
    square: typeof square;
    polygon: typeof polygon;
    triangle: typeof triangle;
};
export declare const primitives3d: {
    cube: typeof cube;
    sphere: typeof sphere;
    geodesicSphere: typeof geodesicSphere;
    cylinder: typeof cylinder;
    torus: typeof torus;
    polyhedron: typeof polyhedron;
};
export * as booleanOps from './modifiers/booleans';
export * as transformations from './modifiers/transforms';
export * as extrusions from './modifiers/extrusions';
export * as maths from './math/mathsHelpersAPI';
export * as text from './text';
export declare const CAG: any, CSG: any, isCAG: any, isCSG: any;
export declare const version: {
    build: string;
    date: string;
    stamp: number;
};
//# sourceMappingURL=main.d.ts.map