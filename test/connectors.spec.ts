import {CSG} from '../src/csg';
import {expect} from 'chai';
import {ConnectorList} from '../src/core/ConnectorList';

describe('CSG Connectors', () => {
  it('CSG.Connector exists', () => {
    expect(CSG).to.have.own.property('Connector');
  });

  it('CSG.connectorslist can be instanciated', () => {
    const observed = new ConnectorList([]);

    expect(observed).to.have.own.property('connectorsList');
    expect(observed.connectorsList).to.deep.eq([]);
  });
});

