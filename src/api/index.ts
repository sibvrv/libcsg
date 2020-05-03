import {circle, cube, cylinder, geodesicSphere, polygon, polyhedron, sphere, square, torus, triangle} from '../primitives';

export * as color from '../color';

export const primitives2d = {circle, square, polygon, triangle};
export const primitives3d = {cube, sphere, geodesicSphere, cylinder, torus, polyhedron};

export * as booleanOps from '../modifiers/booleans';
export * as transformations from '../modifiers/transforms';
export * as extrusions from '../modifiers/extrusions';

export const maths = require('./maths');
export const text = require('./text');

// these are 'external' to this api and we basically just re-export for old api compatibility
// ...needs to be reviewed
export const {CAG, CSG, isCAG, isCSG} = require('../csg');
