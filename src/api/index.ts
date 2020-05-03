export const primitives3d = require('../primitives/primitives3d-api');
export const primitives2d = require('../primitives/primitives2d-api');
export * as booleanOps from '../modifiers/boolean';
export * as transformations from '../modifiers/transforms';
export * as extrusions from '../modifiers/extrusions';
export * as color from '../color';
export const maths = require('./maths');
export const text = require('./text');

// these are 'external' to this api and we basically just re-export for old api compatibility
// ...needs to be reviewed
export const {CAG, CSG, isCAG, isCSG} = require('../csg');
