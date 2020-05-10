import {CAG} from '@core/CAG';
import { expect } from 'chai';

describe('Core CAG', () => {
  it('constructor', () => {
    const cag = new CAG();
    expect(cag).to.have.own.property('sides');
    expect(cag).to.have.own.property('isCanonicalized');
  });
});
