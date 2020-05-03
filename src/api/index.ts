export const primitives3d = require('./primitives3d-api');
export const primitives2d = require('./primitives2d-api');
export const booleanOps = require('./ops-booleans');
export const transformations = require('./ops-transformations');
export const extrusions = require('./ops-extrusions');
export const color = require('./color');
export const maths = require('./maths');
export const text = require('./text');

// these are 'external' to this api and we basically just re-export for old api compatibility
// ...needs to be reviewed
export const {CAG, CSG, isCAG, isCSG} = require('../csg');

// mostly likely needs to be removed since it is in the OpenJsCad namespace anyway, leaving here
// for now

export const csg = {CAG, CSG};
