import { Path2D, TVector3Universal } from '@core/math';
import { Connector } from '@core/Connector';
export declare class ConnectorList {
    closed: boolean;
    connectorsList: Connector[];
    static defaultNormal: number[];
    static fromPath2D(path2D: Path2D, arg1: TVector3Universal, arg2: TVector3Universal): ConnectorList;
    static _fromPath2DTangents(path2D: Path2D, start: TVector3Universal, end: TVector3Universal): ConnectorList;
    static _fromPath2DExplicit(path2D: Path2D, angleIsh: any): ConnectorList;
    /**
     * ConnectorList Constructor
     */
    constructor(connectors: Connector[]);
    setClosed(closed: boolean): void;
    appendConnector(conn: Connector): void;
    followWith(cagish: any): import("./CSG").CSG;
    verify(): void;
}
//# sourceMappingURL=ConnectorList.d.ts.map