import {Plane, Polygon3, Vector3} from '@core/math';

export interface INode {
  plane: Plane | null;
  front: INode | null;
  back: INode | null;
  polygontreenodes: IPolygonTreeNode[];

  invert(): void

  clipPolygons(polygontreenodes: IPolygonTreeNode[], alsoRemoveCoplanarFront?: boolean): void;

  clipTo(tree: ITree, alsoRemoveCoplanarFront?: boolean): void;

  addPolygonTreeNodes(polygontreenodes: IPolygonTreeNode[]): void;

  getParentPlaneNormals(normals: Vector3[], maxdepth: number): void;
}

export interface IPolygonTreeNode {
  parent: IPolygonTreeNode | null;
  children: IPolygonTreeNode[];
  polygon: Polygon3 | null;
  removed: boolean;

  addPolygons(polygons: Polygon3[]): void;

  remove(): void;

  isRemoved(): boolean;

  isRootNode(): boolean;

  invert(): void;

  getPolygon(): Polygon3;

  getPolygons(result: Polygon3[]): void;

  splitByPlane(plane: Plane, coplanarfrontnodes: IPolygonTreeNode[], coplanarbacknodes: IPolygonTreeNode[], frontnodes: IPolygonTreeNode[], backnodes: IPolygonTreeNode[]): void;

  _splitByPlane(plane: Plane, coplanarfrontnodes: IPolygonTreeNode[], coplanarbacknodes: IPolygonTreeNode[], frontnodes: IPolygonTreeNode[], backnodes: IPolygonTreeNode[]): void;

  addChild(polygon: Polygon3): IPolygonTreeNode;

  invertSub(): void;

  recursivelyInvalidatePolygon(): void;
}

interface ITree {
  polygonTree: IPolygonTreeNode;
  rootnode: INode;

  invert(): void;

  clipTo(tree: ITree, alsoRemoveCoplanarFront?: boolean): void;

  allPolygons(): Polygon3[];

  addPolygons(polygons: Polygon3[]): void;
}
