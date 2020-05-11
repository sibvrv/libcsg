import {centerHelper} from './centerHelper';
import {expect} from 'chai';

describe('API: Center', () => {
  it('should return empty object', () => {
    const result = centerHelper({center: [1, 2, 3]}, []);
    expect(result).to.be.deep.eq([]);
  });
});
