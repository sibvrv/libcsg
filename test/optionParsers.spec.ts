import {CSG} from '../src/csg';
import {expect} from 'chai';

describe('Options Parsers', () => {
// NOTE: these are kept for now as a way to make sure the root
// exported object from csg.js has all these helpers

  it('root csg objects provides parseOption', () => {
    expect(CSG.hasOwnProperty('parseOptionAsFloat')).to.be.true;
  });

  it('root csg objects provides parseOptionAsFloat', () => {
    expect(CSG.hasOwnProperty('parseOptionAsFloat')).to.be.true;
  });

  it('root csg objects provides parseOptionAsInt', () => {
    expect(CSG.hasOwnProperty('parseOptionAsInt')).to.be.true;
  });

  it('root csg objects provides parseOptionAsBool', () => {
    expect(CSG.hasOwnProperty('parseOptionAsBool')).to.be.true;
  });

  it('root csg objects provides parseOptionAs2DVector', () => {
    expect(CSG.hasOwnProperty('parseOptionAs2DVector')).to.be.true;
  });

  it('root csg objects provides parseOptionAs3DVector', () => {
    expect(CSG.hasOwnProperty('parseOptionAs3DVector')).to.be.true;
  });

  it('root csg objects provides parseOptionAs3DVectorList', () => {
    expect(CSG.hasOwnProperty('parseOptionAs3DVectorList')).to.be.true;
  });

});
