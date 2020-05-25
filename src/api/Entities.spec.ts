// tslint:disable:no-string-literal

import {Entity} from './Entities';
import {expect} from 'chai';

describe('Entities', () => {
  const $ = Entity;

  it('basic query', () => {

    $.cube(4);
    const cube128 = $.cube(124);

    const isCAGResult = cube128.isCAG();
    const isCSGResult = cube128.isCSG();

    expect(isCAGResult).eq(false);
    expect(isCSGResult).eq(true);
  });

  it('boolean modifier union #1', () => {

    const cube4 = $.cube(4);
    const cube128 = $.cube(124);

    const unionResult = $.union(cube4, cube128);

    expect(unionResult['entities']).to.deep.eq([cube4, cube128]);
  });

  it('boolean modifier union #2', () => {

    const cube4 = $.cube(4);
    const cube128 = $.cube(124);

    const unionResult = cube4.union(cube128);

    expect(unionResult['entities']).to.deep.eq([cube4, cube128]);
  });

  it('boolean modifier union #3', () => {

    const cube4 = $.cube(4);
    const cube128 = $.cube(124);

    const unionResult = cube4.union([cube128, [cube4, cube128, [[[cube4]]]]]);

    expect(unionResult['entities']).to.deep.eq([cube4, cube128, cube4, cube128, cube4]);
  });

  it('boolean modifier union #4', () => {

    const cube4 = $.cube(4);
    const cube128 = $.cube(124);

    const unionResult = $.union(cube4, [cube128, [cube4, cube128, [[[cube4]]]]]);

    expect(unionResult['entities']).to.deep.eq([cube4, cube128, cube4, cube128, cube4]);
  });
});

