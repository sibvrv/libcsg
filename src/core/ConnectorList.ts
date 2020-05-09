import {Path2D, TVector3Universal, Vector3} from './math';
import {CSG} from './CSG';
import {Connector} from './Connector';

export class ConnectorList {
  closed = false;
  connectorsList: Connector[];

  static defaultNormal = [0, 0, 1];

  static fromPath2D(path2D: Path2D, arg1: TVector3Universal, arg2: TVector3Universal) {
    if (arguments.length === 3) {
      return ConnectorList._fromPath2DTangents(path2D, arg1, arg2);
    } else if (arguments.length === 2) {
      return ConnectorList._fromPath2DExplicit(path2D, arg1);
    } else {
      throw new Error('call with path2D and either 2 direction vectors, or a function returning direction vectors');
    }
  };

  /*
   * calculate the connector axisvectors by calculating the "tangent" for path2D.
   * This is undefined for start and end points, so axis for these have to be manually
   * provided.
   */
  static _fromPath2DTangents(path2D: Path2D, start: TVector3Universal, end: TVector3Universal) {
    // path2D
    let axis;
    const pathLen = path2D.points.length;
    const result = new ConnectorList([
      new Connector(path2D.points[0], start, ConnectorList.defaultNormal),
    ]);
    // middle points
    path2D.points.slice(1, pathLen - 1).forEach((p2: any, i: any) => {
      axis = path2D.points[i + 2].minus(path2D.points[i]).toVector3D(0);
      result.appendConnector(
        new Connector(p2.toVector3D(0), axis, ConnectorList.defaultNormal),
      );
    }, this);
    result.appendConnector(
      new Connector(path2D.points[pathLen - 1], end, ConnectorList.defaultNormal),
    );

    result.closed = path2D.closed;
    return result;
  };

  /*
   * angleIsh: either a static angle, or a function(point) returning an angle
   */
  static _fromPath2DExplicit(path2D: Path2D, angleIsh: any) {

    function getAngle(angleIshVal: any, pt: any, i: any) {
      if (typeof angleIshVal === 'function') {
        angleIshVal = angleIshVal(pt, i);
      }
      return angleIshVal;
    }

    const result = new ConnectorList(
      path2D.points.map((p2, i) => {
        return new Connector(p2.toVector3D(0),
          Vector3.Create(1, 0, 0).rotateZ(getAngle(angleIsh, p2, i)),
          ConnectorList.defaultNormal);
      }, this),
    );
    result.closed = path2D.closed;
    return result;
  };

  /**
   * ConnectorList Constructor
   */
  constructor(connectors: Connector[]) {
    this.connectorsList = [...connectors];
  }

  setClosed(closed: boolean) {
    this.closed = !!closed;
  }

  appendConnector(conn: Connector) {
    this.connectorsList.push(conn);
  }

  /*
   * arguments: cagish: a cag or a function(connector) returning a cag
   *            closed: whether the 3d path defined by connectors location
   *              should be closed or stay open
   *              Note: don't duplicate connectors in the path
   * TODO: consider an option "maySelfIntersect" to close & force union all single segments
   */
  followWith(cagish: any) {
    this.verify();

    function getCag(cagishVal: any, connector: Connector) {
      if (typeof cagishVal === 'function') {
        cagishVal = cagishVal(connector.point, connector.axisvector, connector.normalvector);
      }
      return cagishVal;
    }

    const polygons: any[] = [];
    let currCag;
    let prevConnector = this.connectorsList[this.connectorsList.length - 1];
    let prevCag = getCag(cagish, prevConnector);

    // add walls

    this.connectorsList.forEach((connector, notFirst) => {
      currCag = getCag(cagish, connector);
      if (notFirst || this.closed) {
        polygons.push.apply(polygons, prevCag._toWallPolygons({
          toConnector1: prevConnector, toConnector2: connector, cag: currCag,
        }));
      } else {
        // it is the first, and shape not closed -> build start wall
        polygons.push.apply(polygons,
          currCag._toPlanePolygons({toConnector: connector, flipped: true}));
      }

      if (notFirst === this.connectorsList.length - 1 && !this.closed) {
        // build end wall
        polygons.push.apply(polygons,
          currCag._toPlanePolygons({toConnector: connector}));
      }
      prevCag = currCag;
      prevConnector = connector;
    });

    return CSG.fromPolygons(polygons).reTesselated().canonicalized();
  }

  /*
   * general idea behind these checks: connectors need to have smooth transition from one to another
   * TODO: add a check that 2 follow-on CAGs are not intersecting
   */
  verify() {
    let connI;
    let connI1;
    for (let i = 0; i < this.connectorsList.length - 1; i++) {
      connI = this.connectorsList[i];
      connI1 = this.connectorsList[i + 1];
      if (connI1.point.minus(connI.point).dot(connI.axisvector) <= 0) {
        throw new Error('Invalid ConnectorList. Each connectors position needs to be within a <90deg range of previous connectors axisvector');
      }
      if (connI.axisvector.dot(connI1.axisvector) <= 0) {
        throw new Error('invalid ConnectorList. No neighboring connectors axisvectors may span a >=90deg angle');
      }
    }
  }
}
