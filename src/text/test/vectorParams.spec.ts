import {defaultsVectorParams, TEXT_ALIGN, vectorParams} from '../vectorParams';
import {expect} from 'chai';

describe('Vector Params', () => {
  it('should return default params', () => {
    const result = vectorParams();
    expect(result).deep.eq(defaultsVectorParams);
  });

  it('should set the input', () => {
    const result = vectorParams('Simple Test');
    expect(result).deep.eq({...defaultsVectorParams, input: 'Simple Test'});
  });

  it('should set the input from options', () => {
    const result = vectorParams({input: 'text'}, 'text 2');
    expect(result).deep.eq({...defaultsVectorParams, input: 'text'});
  });

  it('should set the input from arguments', () => {
    const result = vectorParams({align: TEXT_ALIGN.RIGHT}, 'text 2');
    expect(result).deep.eq({...defaultsVectorParams, input: 'text 2', align: TEXT_ALIGN.RIGHT});
  });
});
