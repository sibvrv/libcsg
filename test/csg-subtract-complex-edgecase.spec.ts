import {CSG} from '../src/csg';
import {expect} from 'chai';

function createOperands() {

  // test solids that fail with default EPS, at EPS = 0.001 this test will pass
  const binSolid1 = JSON.parse('{"polygons":[{"vertices":[{"pos":{"_x":-9449.999999999996,"_y":0,"_z":7850}},{"pos":{"_x":-9449.999999999996,"_y":0,"_z":7960}},{"pos":{"_x":-9449.999999999996,"_y":2760,"_z":7960}},{"pos":{"_x":-9449.999999999996,"_y":2760,"_z":7850}}],"shared":{"color":[0.62,0.156,0.099,1]},"plane":{"normal":{"_x":-1,"_y":0,"_z":0},"w":9450}},{"vertices":[{"pos":{"_x":-6137.0540540999955,"_y":0,"_z":7849.999999999999}},{"pos":{"_x":-6137.0540540999955,"_y":2760,"_z":7849.999999999999}},{"pos":{"_x":-6137.0540540999955,"_y":2760,"_z":7959.999999999999}},{"pos":{"_x":-6137.0540540999955,"_y":0,"_z":7959.999999999999}}],"shared":{"color":[0.003,0.911,0.224,1]},"plane":{"normal":{"_x":1,"_y":0,"_z":0},"w":-6137.0541}},{"vertices":[{"pos":{"_x":-9449.999999999996,"_y":0,"_z":7850}},{"pos":{"_x":-6137.0540540999955,"_y":0,"_z":7849.999999999999}},{"pos":{"_x":-6137.0540540999955,"_y":0,"_z":7959.999999999999}},{"pos":{"_x":-9449.999999999996,"_y":0,"_z":7960}}],"shared":{"color":[0.421,0.267,0.669,1]},"plane":{"normal":{"_x":0,"_y":-1,"_z":0},"w":0}},{"vertices":[{"pos":{"_x":-9449.999999999996,"_y":2760,"_z":7850}},{"pos":{"_x":-9449.999999999996,"_y":2760,"_z":7960}},{"pos":{"_x":-6137.0540540999955,"_y":2760,"_z":7959.999999999999}},{"pos":{"_x":-6137.0540540999955,"_y":2760,"_z":7849.999999999999}}],"shared":{"color":[0.48,0.878,0.467,1]},"plane":{"normal":{"_x":0,"_y":1,"_z":0},"w":2760}},{"vertices":[{"pos":{"_x":-9449.999999999996,"_y":0,"_z":7850}},{"pos":{"_x":-9449.999999999996,"_y":2760,"_z":7850}},{"pos":{"_x":-6137.0540540999955,"_y":2760,"_z":7849.999999999999}},{"pos":{"_x":-6137.0540540999955,"_y":0,"_z":7849.999999999999}}],"shared":{"color":[0.309,0.411,0.848,1]},"plane":{"normal":{"_x":0,"_y":0,"_z":-1},"w":-7850}},{"vertices":[{"pos":{"_x":-9449.999999999996,"_y":0,"_z":7960}},{"pos":{"_x":-6137.0540540999955,"_y":0,"_z":7959.999999999999}},{"pos":{"_x":-6137.0540540999955,"_y":2760,"_z":7959.999999999999}},{"pos":{"_x":-9449.999999999996,"_y":2760,"_z":7960}}],"shared":{"color":[0.09,0.323,0.855,1]},"plane":{"normal":{"_x":0,"_y":0,"_z":1},"w":7960}}],"properties":{"cube":{"center":{"_x":-7793.527027049996,"_y":1380,"_z":7905},"facecenters":[{"point":{"_x":-6137.0540540999955,"_y":1380,"_z":7904.999999999999},"axisvector":{"_x":1,"_y":0,"_z":0},"normalvector":{"_x":0,"_y":0,"_z":1}},{"point":{"_x":-9449.999999999996,"_y":1380,"_z":7905},"axisvector":{"_x":-1,"_y":0,"_z":0},"normalvector":{"_x":0,"_y":0,"_z":1}},{"point":{"_x":-7793.527027049996,"_y":2760,"_z":7905},"axisvector":{"_x":0,"_y":1,"_z":0},"normalvector":{"_x":0,"_y":0,"_z":1}},{"point":{"_x":-7793.527027049996,"_y":0,"_z":7905},"axisvector":{"_x":0,"_y":-1,"_z":0},"normalvector":{"_x":0,"_y":0,"_z":1}},{"point":{"_x":-7793.527027049996,"_y":1380,"_z":7960},"axisvector":{"_x":0,"_y":0,"_z":1},"normalvector":{"_x":1,"_y":0,"_z":0}},{"point":{"_x":-7793.527027049996,"_y":1380,"_z":7850},"axisvector":{"_x":0,"_y":0,"_z":-1},"normalvector":{"_x":1,"_y":0,"_z":0}}]},"base_refs":{"outer_lower_left":{"_x":-9449.999999999996,"_y":0,"_z":7960},"outer_upper_left":{"_x":-9449.999999999996,"_y":2760,"_z":7960},"outer_lower_right":{"_x":-6137.0540540999955,"_y":0,"_z":7959.999999999999},"inner_lower_left":{"_x":-9449.999999999996,"_y":0,"_z":7850},"inner_lower_right":{"_x":-6247.0540540999955,"_y":0,"_z":7849.999999999999},"cnct_outside":{"point":{"_x":-7793.527027049996,"_y":1380,"_z":7960},"axisvector":{"_x":0,"_y":0,"_z":1},"normalvector":{"_x":0,"_y":1,"_z":0}},"cnct_inside":{"point":{"_x":-7793.527027049996,"_y":1380,"_z":7850},"axisvector":{"_x":0,"_y":0,"_z":-1},"normalvector":{"_x":0,"_y":1,"_z":0}}},"opening_refs":{}},"isCanonicalized":false,"isRetesselated":false}');
  const binSolid2 = JSON.parse('{"polygons":[{"vertices":[{"pos":{"_x":5.004999999999999,"_y":11500,"_z":-5.004999999999999}},{"pos":{"_x":-9794.785,"_y":11500,"_z":-5.004999999998799}},{"pos":{"_x":-9794.785,"_y":11500,"_z":8303.295000000002}},{"pos":{"_x":5.004999999999999,"_y":11500,"_z":8303.295}}],"shared":{"color":null,"tag":2268},"plane":{"normal":{"_x":0,"_y":1,"_z":0},"w":11500},"cachedBoundingBox":[{"_x":-9794.785,"_y":11500,"_z":-5.004999999999999},{"_x":5.004999999999999,"_y":11500,"_z":8303.295000000002}],"cachedBoundingSphere":[{"_x":-4894.89,"_y":11500,"_z":4149.145000000001},6423.856570123979]},{"vertices":[{"pos":{"_x":5.004999999999999,"_y":1500,"_z":8303.295}},{"pos":{"_x":5.004999999999999,"_y":11500,"_z":8303.295}},{"pos":{"_x":-9794.785,"_y":11500,"_z":8303.295000000002}},{"pos":{"_x":-9794.785,"_y":1500,"_z":8303.295}}],"shared":{"color":null,"tag":2268},"plane":{"normal":{"_x":0,"_y":0,"_z":1},"w":8303.295},"cachedBoundingBox":[{"_x":-9794.785,"_y":1500,"_z":8303.295},{"_x":5.004999999999999,"_y":11500,"_z":8303.295000000002}],"cachedBoundingSphere":[{"_x":-4894.89,"_y":6500,"_z":8303.295000000002},7000.640757175374]},{"vertices":[{"pos":{"_x":-9794.785,"_y":11500,"_z":8303.295000000002}},{"pos":{"_x":-9794.785,"_y":11500,"_z":4149.14499999532}},{"pos":{"_x":-9794.785,"_y":4093.2078104205984,"_z":4149.14499999532}},{"pos":{"_x":-9794.785,"_y":1500,"_z":8303.295}}],"shared":{"color":null,"tag":2268},"plane":{"normal":{"_x":-1,"_y":0,"_z":0},"w":9794.785},"cachedBoundingBox":[{"_x":-9794.785,"_y":1500,"_z":4149.14499999532},{"_x":-9794.785,"_y":11500,"_z":8303.295000000002}],"cachedBoundingSphere":[{"_x":-9794.785,"_y":6500,"_z":6226.219999997661},5414.262697324052]},{"vertices":[{"pos":{"_x":-9794.785,"_y":11500,"_z":4149.14499999532}},{"pos":{"_x":-9794.785,"_y":11500,"_z":-5.004999999998799}},{"pos":{"_x":-9794.785,"_y":1500.0000000000005,"_z":-5.004999999998799}},{"pos":{"_x":-9794.785,"_y":4093.2078104205984,"_z":4149.14499999532}}],"shared":{"color":null,"tag":2268},"plane":{"normal":{"_x":-1,"_y":0,"_z":0},"w":9794.785},"cachedBoundingBox":[{"_x":-9794.785,"_y":1500.0000000000005,"_z":-5.004999999998799},{"_x":-9794.785,"_y":11500,"_z":4149.14499999532}],"cachedBoundingSphere":[{"_x":-9794.785,"_y":6500,"_z":2072.0699999976605},5414.262697322257]},{"vertices":[{"pos":{"_x":-9794.785,"_y":11500,"_z":-5.004999999998799}},{"pos":{"_x":5.004999999999999,"_y":11500,"_z":-5.004999999999999}},{"pos":{"_x":5.004999999999999,"_y":1500,"_z":-5.004999999999999}},{"pos":{"_x":-9794.785,"_y":1500.0000000000005,"_z":-5.004999999998799}}],"shared":{"color":null,"tag":2268},"plane":{"normal":{"_x":0,"_y":0,"_z":-1},"w":5.004999999999999},"cachedBoundingBox":[{"_x":-9794.785,"_y":1500,"_z":-5.004999999999999},{"_x":5.004999999999999,"_y":11500,"_z":-5.004999999998799}],"cachedBoundingSphere":[{"_x":-4894.89,"_y":6500,"_z":-5.004999999999399},7000.640757175374]},{"vertices":[{"pos":{"_x":5.004999999999999,"_y":11500,"_z":-5.004999999999999}},{"pos":{"_x":5.004999999999999,"_y":11500,"_z":4149.144999995322}},{"pos":{"_x":5.004999999999999,"_y":4093.2078104205975,"_z":4149.144999995322}},{"pos":{"_x":5.004999999999999,"_y":1500,"_z":-5.004999999999999}}],"shared":{"color":null,"tag":2268},"plane":{"normal":{"_x":1,"_y":0,"_z":0},"w":5.004999999999999},"cachedBoundingBox":[{"_x":5.004999999999999,"_y":1500,"_z":-5.004999999999999},{"_x":5.004999999999999,"_y":11500,"_z":4149.144999995322}],"cachedBoundingSphere":[{"_x":5.004999999999999,"_y":6500,"_z":2072.069999997661},5414.262697322257]},{"vertices":[{"pos":{"_x":5.004999999999999,"_y":11500,"_z":4149.144999995322}},{"pos":{"_x":5.004999999999999,"_y":11500,"_z":8303.295}},{"pos":{"_x":5.004999999999999,"_y":1500,"_z":8303.295}},{"pos":{"_x":5.004999999999999,"_y":4093.2078104205975,"_z":4149.144999995322}}],"shared":{"color":null,"tag":2268},"plane":{"normal":{"_x":1,"_y":0,"_z":0},"w":5.004999999999999},"cachedBoundingBox":[{"_x":5.004999999999999,"_y":1500,"_z":4149.144999995322},{"_x":5.004999999999999,"_y":11500,"_z":8303.295}],"cachedBoundingSphere":[{"_x":5.004999999999999,"_y":6500,"_z":6226.219999997661},5414.262697324051]},{"vertices":[{"pos":{"_x":-9794.785,"_y":1500,"_z":8303.295}},{"pos":{"_x":-9794.785,"_y":4093.2078104205984,"_z":4149.14499999532}},{"pos":{"_x":5.004999999999999,"_y":4093.2078104205975,"_z":4149.144999995322}},{"pos":{"_x":5.004999999999999,"_y":1500,"_z":8303.295}}],"shared":{"color":[0.886,0.623,0.966,1],"tag":2434},"plane":{"normal":{"_x":0,"_y":-0.8482859836143414,"_z":-0.5295383744389536},"w":-5669.342312209814},"cachedBoundingBox":[{"_x":-9794.785,"_y":1500,"_z":4149.14499999532},{"_x":5.004999999999999,"_y":4093.2078104205984,"_z":8303.295}],"cachedBoundingSphere":[{"_x":-4894.89,"_y":2796.603905210299,"_z":6226.21999999766},5477.6266077258615]},{"vertices":[{"pos":{"_x":-9794.785,"_y":1500.0000000000005,"_z":-5.004999999998799}},{"pos":{"_x":5.004999999999999,"_y":1500,"_z":-5.004999999999999}},{"pos":{"_x":5.004999999999999,"_y":4093.2078104205975,"_z":4149.144999995322}},{"pos":{"_x":-9794.785,"_y":4093.2078104205984,"_z":4149.14499999532}}],"shared":{"color":[0.353,0.366,0.185,1],"tag":2422},"plane":{"normal":{"_x":0,"_y":-0.8482859836136329,"_z":0.5295383744400884},"w":-1275.0793149846438},"cachedBoundingBox":[{"_x":-9794.785,"_y":1500,"_z":-5.004999999999999},{"_x":5.004999999999999,"_y":4093.2078104205984,"_z":4149.144999995322}],"cachedBoundingSphere":[{"_x":-4894.89,"_y":2796.603905210299,"_z":2072.069999997661},5477.626607724087]}],"properties":{},"isCanonicalized":true,"isRetesselated":true}');

  const a = CSG.fromObject(binSolid1);
  const b = CSG.fromObject(binSolid2);

  return {a, b};
}

/**
 * resulting solid from subtract can never be bigger then before subtract operation, check bounds for that
 * @param resultSolid
 * @param baseSolid
 * @param failMessage
 */
function checkGeomBounds(resultSolid: any, baseSolid: any, failMessage = 'resulting solid is bigger after subraction') {

  const bndsBaseSolid = baseSolid.getBounds();
  const distBase = bndsBaseSolid[0].distanceTo(bndsBaseSolid[1]);
  const bndsResultSolid = resultSolid.getBounds();
  const distResult = bndsResultSolid[0].distanceTo(bndsResultSolid[1]);

  expect(distResult > distBase, failMessage).to.be.false;
}

describe('CSG Subtract Complex EdgeCase', () => {
// perform test
  it.skip('CSG.complex_edgecase_subtract', () => {
    const {a, b} = createOperands();
    checkGeomBounds(a.subtract(b), a);
  });

});
