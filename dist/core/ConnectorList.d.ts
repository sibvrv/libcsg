import { Path2D, TVector3Universal } from '@core/math';
import { Connector } from '@core/Connector';
export declare class ConnectorList {
    closed: boolean;
    connectorsList: Connector[];
    static defaultNormal: number[];
    /**
     * make ConnectorList from Path2D
     * @param path2D
     * @param arg1
     * @param arg2
     */
    static fromPath2D(path2D: Path2D, arg1: TVector3Universal, arg2: TVector3Universal): ConnectorList;
    /**
     * calculate the connector axisvectors by calculating the "tangent" for path2D.
     * This is undefined for start and end points, so axis for these have to be manually
     * provided.
     * @param path2D
     * @param start
     * @param end
     * @private
     */
    static _fromPath2DTangents(path2D: Path2D, start: TVector3Universal, end: TVector3Universal): ConnectorList;
    /**
     * From Path2D Explicit
     * angleIsh: either a static angle, or a function(point) returning an angle
     * @param path2D
     * @param angleIsh
     * @private
     */
    static _fromPath2DExplicit(path2D: Path2D, angleIsh: any): ConnectorList;
    /**
     * ConnectorList Constructor
     */
    constructor(connectors: Connector[]);
    /**
     * Set Closed
     * @param closed
     */
    setClosed(closed: boolean): void;
    /**
     * Append Connector
     * @param conn
     */
    appendConnector(conn: Connector): void;
    /**
     * Follow With
     * arguments: cagish: a cag or a function(connector) returning a cag
     *            closed: whether the 3d path defined by connectors location
     *              should be closed or stay open
     *              Note: don't duplicate connectors in the path
     * TODO: consider an option "maySelfIntersect" to close & force union all single segments
     * @param cagish
     */
    followWith(cagish: any): import("./CSG").CSG;
    /**
     * Verify
     * general idea behind these checks: connectors need to have smooth transition from one to another
     * TODO: add a check that 2 follow-on CAGs are not intersecting
     */
    verify(): void;
}
//# sourceMappingURL=ConnectorList.d.ts.map