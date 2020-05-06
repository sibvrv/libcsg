import {Vector2} from './Vector2';
import {expect} from 'chai';

describe('Math: Vector2', () => {
  it('empty vector initialization', () => {
    const result = new Vector2();
    expect(result.x).to.be.eq(0);
    expect(result.y).to.be.eq(0);
  });
});
