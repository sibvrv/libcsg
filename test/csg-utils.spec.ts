import test from 'ava';
import {CAG, CSG} from '../src/csg';

// returns positions and tags for simplicity
const flatPolygons = (polygon: any) => {
  return polygon.vertices.map((p: any) => [p.pos._x, p.pos._y, p.pos.z, p.tag]);
};
// TODO: note to self:  do actual in depth testing based on UNDERSTANDING the algorithm

test('CSG.fixTJunctions fixes ...tjunctions', t => {
  const input = new CSG.cube().fixTJunctions();
  // not strictily needed as there are no tjunctions, but polygons should stay intact
  const obsPolygons = input.polygons.map(flatPolygons).sort();
  const expPolygons = [[[-1, -1, -1, 2],
    [-1, -1, 1, 3],
    [-1, 1, 1, 4],
    [-1, 1, -1, 1]],
    [[-1, -1, -1, 2],
      [-1, 1, -1, 1],
      [1, 1, -1, 7],
      [1, -1, -1, 6]],
    [[-1, -1, -1, 2],
      [1, -1, -1, 6],
      [1, -1, 1, 5],
      [-1, -1, 1, 3]],
    [[-1, -1, 1, 3],
      [1, -1, 1, 5],
      [1, 1, 1, 8],
      [-1, 1, 1, 4]],
    [[-1, 1, -1, 1],
      [-1, 1, 1, 4],
      [1, 1, 1, 8],
      [1, 1, -1, 7]],
    [[1, -1, -1, 6],
      [1, 1, -1, 7],
      [1, 1, 1, 8],
      [1, -1, 1, 5]]];
  t.is(input.isCanonicalized, true);
  t.deepEqual(obsPolygons, expPolygons);
});

// yikes, horrible name
test('CSG.fixTJunctions should work correctly even in corner cases', t => {
  const csgImage = CAG.fromPoints([[25.183085182520657, -16.31346279512401],
    [25.399997999999997, -14.111109999999998],
    [25.18308518252066, -11.908757204875993],
    [24.540682568012272, -9.791039592574926],
    [23.497477328686852, -7.839339863307808],
    [22.09355925685544, -6.128660743144558],
    [20.38288013669219, -4.724742671313145],
    [18.43118040742507, -3.6815374319877243],
    [16.313462795124003, -3.0391348174793364],
    [14.111109999999998, -2.822222],
    [11.908757204875993, -3.0391348174793364],
    [9.791039592574926, -3.6815374319877243],
    [7.839339863307811, -4.724742671313143],
    [6.128660743144558, -6.1286607431445566],
    [4.724742671313143, -7.839339863307808],
    [3.6815374319877243, -9.791039592574924],
    [3.0391348174793364, -11.90875720487599],
    [2.822222, -14.111109999999996],
    [3.0391348174793364, -16.313462795124003],
    [3.6815374319877243, -18.43118040742507],
    [4.724742671313141, -20.382880136692187],
    [6.128660743144556, -22.09355925685544],
    [7.839339863307808, -23.497477328686852],
    [9.791039592574919, -24.54068256801227],
    [11.908757204875988, -25.183085182520657],
    [14.111109999999996, -25.399997999999997],
    [16.313462795124003, -25.18308518252066],
    [18.431180407425074, -24.540682568012272],
    [20.382880136692183, -23.497477328686855],
    [22.093559256855436, -22.093559256855443],
    [23.497477328686852, -20.382880136692187],
    [24.54068256801227, -18.431180407425078]]);

  const block = CSG.cube({center: [5, 5, 5], radius: 20});
  const engraving = csgImage.extrude([0, 0, 5]);
  const input = block.subtract(engraving);
  const afterFix = input.fixTJunctions();

  const after = afterFix.polygons.map(flatPolygons).sort();
  const expectedPolygons = [[[-15, -15, -15, 35],
    [-15, -15, 0, 80],
    [-15, -15, 1, 81],
    [-15, -15, 25, 36],
    [-15, 25, 25, 37],
    [-15, 25, -15, 34]],
    [[-15, -15, -15, 35],
      [-15, 25, -15, 34],
      [25, 25, -15, 38],
      [25, -15, -15, 40]],
    [[-15, -15, 25, 36],
      [25, -15, 25, 41],
      [25, 25, 25, 39],
      [-15, 25, 25, 37]],
    [[-15, 25, -15, 34],
      [-15, 25, 25, 37],
      [25, 25, 25, 39],
      [25, 25, 1, 79],
      [25, 25, 0, 78],
      [25, 25, -15, 38]],
    [[11.908757204875993, -3.039134817479336, 1, 56],
      [9.791039592574927, -3.6815374319877257, 1.0000000000000004, 58],
      [9.791039592574927, -3.6815374319877257, 0, 59],
      [11.908757204875993, -3.039134817479336, 0, 57]],
    [[14.111109999999998, -2.822222, 1, 54],
      [11.908757204875993, -3.039134817479336, 1, 56],
      [11.908757204875993, -3.039134817479336, 0, 57],
      [14.111109999999998, -2.822222, 0, 55]],
    [[14.111109999999998, -2.822222, 1, 54],
      [16.313462795124007,
        -3.0391348174793373,
        1.0000000000000004,
        52],
      [18.43118040742507, -3.6815374319877234, 1, 50],
      [20.382880136692194, -4.724742671313146, 1, 48],
      [22.093559256855443, -6.128660743144557, 1, 46],
      [23.497477328686852, -7.839339863307812, 1, 44],
      [24.540682568012272, -9.79103959257493, 1, 43],
      [25.000000000000007,
        -11.305206243502543,
        1.0000000000000004,
        73],
      [25, -15, 1, 77],
      [2.9097700235301502, -15, 1, 74],
      [2.822222, -14.111109999999998, 1, 70],
      [3.039134817479336, -11.90875720487599, 1, 68],
      [3.6815374319877243, -9.791039592574926, 1.0000000000000004, 66],
      [4.724742671313144, -7.83933986330781, 1, 64],
      [6.128660743144558, -6.128660743144557, 1, 62],
      [7.8393398633078135, -4.724742671313145, 1.0000000000000004, 60],
      [9.791039592574927, -3.6815374319877257, 1.0000000000000004, 58],
      [11.908757204875993, -3.039134817479336, 1, 56]],
    [[16.313462795124007,
      -3.0391348174793373,
      1.0000000000000004,
      52],
      [14.111109999999998, -2.822222, 1, 54],
      [14.111109999999998, -2.822222, 0, 55],
      [16.313462795124007, -3.0391348174793373, 0, 53]],
    [[18.43118040742507, -3.6815374319877234, 1, 50],
      [16.313462795124007,
        -3.0391348174793373,
        1.0000000000000004,
        52],
      [16.313462795124007, -3.0391348174793373, 0, 53],
      [18.43118040742507, -3.6815374319877234, 0, 51]],
    [[2.822222, -14.111109999999998, 1, 70],
      [2.9097700235301502, -15, 1, 74],
      [2.9097700235301502, -15, 0, 75],
      [2.822222, -14.111109999999998, 0, 71]],
    [[2.9097700235301502, -15, 0, 75],
      [2.9097700235301502, -15, 1, 74],
      [-15, -15, 1, 81],
      [-15, -15, 0, 80]],
    [[2.9097700235301502, -15, 1, 74],
      [25, -15, 1, 77],
      [25, -15, 25, 41],
      [-15, -15, 25, 36],
      [-15, -15, 1, 81]],
    [[20.382880136692194, -4.724742671313146, 1, 48],
      [18.43118040742507, -3.6815374319877234, 1, 50],
      [18.43118040742507, -3.6815374319877234, 0, 51],
      [20.382880136692194, -4.724742671313146, 0, 49]],
    [[22.093559256855443, -6.128660743144557, 1, 46],
      [20.382880136692194, -4.724742671313146, 1, 48],
      [20.382880136692194, -4.724742671313146, 0, 49],
      [22.093559256855443, -6.128660743144557, 0, 47]],
    [[23.497477328686852, -7.839339863307812, 1, 44],
      [22.093559256855443, -6.128660743144557, 1, 46],
      [22.093559256855443, -6.128660743144557, 0, 47],
      [23.497477328686852, -7.839339863307812, 0, 45]],
    [[24.540682568012272, -9.79103959257493, 1, 43],
      [23.497477328686852, -7.839339863307812, 1, 44],
      [23.497477328686852, -7.839339863307812, 0, 45],
      [24.540682568012272, -9.79103959257493, 0, 42]],
    [[25, -15, -15, 40],
      [25, -15, 0, 76],
      [2.9097700235301502, -15, 0, 75],
      [-15, -15, 0, 80],
      [-15, -15, -15, 35]],
    [[25, -15, 0, 76],
      [25.000000000000007, -11.305206243502543, 0, 72],
      [24.540682568012272, -9.79103959257493, 0, 42],
      [23.497477328686852, -7.839339863307812, 0, 45],
      [22.093559256855443, -6.128660743144557, 0, 47],
      [20.382880136692194, -4.724742671313146, 0, 49],
      [18.43118040742507, -3.6815374319877234, 0, 51],
      [16.313462795124007, -3.0391348174793373, 0, 53],
      [14.111109999999998, -2.822222, 0, 55],
      [11.908757204875993, -3.039134817479336, 0, 57],
      [9.791039592574927, -3.6815374319877257, 0, 59],
      [7.8393398633078135, -4.724742671313145, 0, 61],
      [6.128660743144558, -6.128660743144557, 0, 63],
      [4.724742671313144, -7.83933986330781, 0, 65],
      [3.6815374319877243, -9.791039592574926, 0, 67],
      [3.039134817479336, -11.90875720487599, 0, 69],
      [2.822222, -14.111109999999998, 0, 71],
      [2.9097700235301502, -15, 0, 75]],
    [[25, 25, -15, 38],
      [25, 25, 0, 78],
      [25.000000000000007, -11.305206243502543, 0, 72],
      [25, -15, 0, 76],
      [25, -15, -15, 40]],
    [[25, 25, 0, 78],
      [25, 25, 1, 79],
      [25.000000000000007,
        -11.305206243502543,
        1.0000000000000004,
        73],
      [25.000000000000007, -11.305206243502543, 0, 72]],
    [[25.000000000000007,
      -11.305206243502543,
      1.0000000000000004,
      73],
      [24.540682568012272, -9.79103959257493, 1, 43],
      [24.540682568012272, -9.79103959257493, 0, 42],
      [25.000000000000007, -11.305206243502543, 0, 72]],
    [[25.000000000000007,
      -11.305206243502543,
      1.0000000000000004,
      73],
      [25, 25, 1, 79],
      [25, 25, 25, 39],
      [25, -15, 25, 41],
      [25, -15, 1, 77]],
    [[3.039134817479336, -11.90875720487599, 1, 68],
      [2.822222, -14.111109999999998, 1, 70],
      [2.822222, -14.111109999999998, 0, 71],
      [3.039134817479336, -11.90875720487599, 0, 69]],
    [[3.6815374319877243, -9.791039592574926, 1.0000000000000004, 66],
      [3.039134817479336, -11.90875720487599, 1, 68],
      [3.039134817479336, -11.90875720487599, 0, 69],
      [3.6815374319877243, -9.791039592574926, 0, 67]],
    [[4.724742671313144, -7.83933986330781, 1, 64],
      [3.6815374319877243, -9.791039592574926, 1.0000000000000004, 66],
      [3.6815374319877243, -9.791039592574926, 0, 67],
      [4.724742671313144, -7.83933986330781, 0, 65]],
    [[6.128660743144558, -6.128660743144557, 1, 62],
      [4.724742671313144, -7.83933986330781, 1, 64],
      [4.724742671313144, -7.83933986330781, 0, 65],
      [6.128660743144558, -6.128660743144557, 0, 63]],
    [[7.8393398633078135, -4.724742671313145, 1.0000000000000004, 60],
      [6.128660743144558, -6.128660743144557, 1, 62],
      [6.128660743144558, -6.128660743144557, 0, 63],
      [7.8393398633078135, -4.724742671313145, 0, 61]],
    [[9.791039592574927, -3.6815374319877257, 1.0000000000000004, 58],
      [7.8393398633078135, -4.724742671313145, 1.0000000000000004, 60],
      [7.8393398633078135, -4.724742671313145, 0, 61],
      [9.791039592574927, -3.6815374319877257, 0, 59]]];

  t.is(input.isCanonicalized, true);
  t.deepEqual(after, expectedPolygons);
});
