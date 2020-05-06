import {Vector2} from './Vector2';
import {expect} from 'chai';
import {Vector3} from './Vector3';

describe('Math: Vector2', () => {

  const testCases = [
    {expect: [0, 0], value: []},
    {expect: [0, 0], value: [0]},
    {expect: [0, 0], value: ['']},
    {expect: [0, 1], value: ['', 1]},
    {expect: [0, 1], value: ['', 1]},
    {expect: [0, 4], value: [, 4]},
    {expect: [2, 3], value: [2, 3]},
    {expect: [-1, -9], value: [-1, -9]},
    {expect: [2, 3], value: [[2, 3]]},
    {expect: [2, 0], value: [[2]]},
    {expect: [0, 0], value: [[]]},
    {expect: [0, 0], value: [[], [2]]},
    {expect: [5, 0], value: [{x: 5}]},
    {expect: [0, 8], value: [{y: 8}]},
    {expect: [1, 2], value: [new Vector3(1, 2, 3)]},
    {expect: [7, 5], value: [new Vector2(7, 5)]},
    {expect: [3, 9], value: ['3', '9']},
    {expect: [-3, -9], value: ['-3', -9]},
    {expect: [1e6, 1e5], value: ['1e6', 1e5]},
    {expect: [0, 0], value: [NaN, NaN]},
    {expect: [0, 0], value: [null, null]},
    {expect: [0, 0], value: [false, false]},
    {expect: [Infinity, -Infinity], value: [Infinity, -Infinity]},
    {expect: [-Infinity, Infinity], value: [-Infinity, Infinity]},
  ];

  it('initialization of an empty vector', () => {
    const result = new Vector2();
    expect(result.x).to.be.eq(0);
    expect(result.y).to.be.eq(0);
  });

  it('should be true for all cases', () => {
    testCases.forEach((testCase, index) => {
      const [valueX, valueY] = testCase.value;
      const [expectedX, expectedY] = testCase.expect;
      const result = new Vector2(valueX as any, valueY as any);
      const message = `CaseID: #${1 + index}: Arguments:  (${JSON.stringify(valueX)}, ${JSON.stringify(valueY)}) -> Expected (${expectedX}, ${expectedY})`;
      expect(result.x, message).to.be.eq(expectedX);
      expect(result.y, message).to.be.eq(expectedY);
    });
  });

});
