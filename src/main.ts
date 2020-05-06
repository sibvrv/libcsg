import {circle, cube, cylinder, geodesicSphere, polygon, polyhedron, sphere, square, torus, triangle} from './primitives';

export * as color from './color';

export const primitives2d = {circle, square, polygon, triangle};
export const primitives3d = {cube, sphere, geodesicSphere, cylinder, torus, polyhedron};

export * as booleanOps from './modifiers/booleans';
export * as transformations from './modifiers/transforms';
export * as extrusions from './modifiers/extrusions';

export * as maths from './math/mathsHelpersAPI';
export * as text from './text';

// these are 'external' to this api and we basically just re-export for old api compatibility
// ...needs to be reviewed
export {CSG} from './core/CSG';
export {CAG} from './core/CAG';

export {isCAG, isCSG} from './core/utils';

declare var __LIB_VERSION__: { build: string; date: string; stamp: number; };
export const version = __LIB_VERSION__;
