import {circle, cube, torus} from '@root/primitives';
import {linear_extrude} from '@modifiers/extrusions';
import {intersection, union} from '@modifiers/booleans';
import {expect} from 'chai';

// any tests that involve multiple operands (extrude with union translate with difference etc)
// and are not testing a specific feature (union, difference, translate etc)
// belong here
describe('Combined tests', () => {
  describe('Extrude Tests', () => {
    it('linear_extrude of union of 2d shapes', () => {
      const obs = linear_extrude({height: 0.1}, union([
        circle({r: 8, center: true}).translate([0, 20, 0]),
        circle({r: 8, center: true}),
      ]));

      expect(obs.polygons.length).to.eq(142);
    });
  });

  describe('Intersection', () => {
    it('intersection of torus where ro===r1 and cube', () => {
      const obs = intersection(
        torus({ro: 0.5, ri: 0.5}),
        cube(),
      );

      expect(obs.polygons.length).to.eq(67);
    });
  });
});
