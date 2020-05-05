import {CSG} from '../src/csg';
import {expect} from 'chai';

describe('CSG Connectors', () => {
  it('CSG.Connector exists', () => {
    expect(CSG).to.have.own.property('Connector');
  });

  it('CSG.connectorslist can be instanciated', () => {
    const observed = new CSG.ConnectorList();

    expect(observed).to.have.own.property('connectors_');
    expect(observed.connectors_).to.deep.eq([]);
  });
});

