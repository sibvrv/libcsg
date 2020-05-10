import {cube, sphere, square} from '@root/primitives';
import {difference, intersection, union} from '../index';
import {expect} from 'chai';

describe('Modifiers: Boolean operations', () => {
  it('union (defaults)', () => {
    const op1 = cube();
    const op2 = cube({size: 10});

    const obs = union(op1, op2);

    expect(obs.polygons.length).to.eq(6);
  });

  it('union (more than 2 operands)', () => {
    const op1 = cube();
    const op2 = cube();
    const op3 = cube({size: 10});

    const obs = union(op1, op2, op3);

    expect(obs.polygons.length).to.eq(6);
  });

  it('union (complex)', () => {
    const obs = union(
      difference(
        cube({size: 3, center: true}),
        sphere({r: 2, center: true}),
      ),
      intersection(
        sphere({r: 1.3, center: true}),
        cube({size: 2.1, center: true}),
      ),
    );

    expect(obs.polygons.length).to.eq(610);
  });

  it('union (2d & 3d shapes)', () => {
    const op1 = cube();
    const op2 = square([10, 2]);

    const obs = union({extrude2d: true}, op1, op2);

    expect(obs.polygons.length).to.eq(6);
  });

  it('difference (defaults)', () => {
    const op1 = cube({size: [10, 10, 1]});
    const op2 = cube({size: [1, 1, 10]});

    const obs = difference(op1, op2);

    expect(obs.polygons.length).to.eq(10);
  });

  it('difference (more than 2 operands)', () => {
    const op1 = cube({size: [10, 10, 1]});
    const op2 = cube({size: [1, 1, 10]});
    const op3 = cube({size: [3, 3, 10]});

    const obs = difference(op1, op2, op3);

    expect(obs.polygons.length).to.eq(10);
  });

  it('difference (2d & 3d shapes)', () => {
    const op1 = cube({size: [10, 10, 1]});
    const op2 = square([10, 2]);

    const obs = difference(op1, op2);

    expect(obs.polygons.length).to.eq(6);
  });

  it('intersection (defaults)', () => {
    const op1 = cube({size: [10, 10, 1]});
    const op2 = cube({size: [1, 1, 10]});

    const obs = difference(op1, op2);

    expect(obs.polygons.length).to.eq(10);
  });

  it('intersection (more than 2 operands)', () => {
    const op1 = cube({size: [10, 10, 1]});
    const op2 = cube({size: [1, 1, 10]});
    const op3 = cube({size: [3, 3, 10]});

    const obs = intersection(op1, op2);

    expect(obs.polygons.length).to.eq(6);
  });

  it('intersection (2d & 3d shapes)', () => {
    const op1 = cube({size: [10, 10, 1]});
    const op2 = cube({size: [1, 1, 10]});

    const obs = intersection(op1, op2);

    expect(obs.polygons.length).to.eq(6);
  });
});
