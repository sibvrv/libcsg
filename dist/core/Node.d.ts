import { Plane, Vector3 } from '@core/math';
import { Tree } from '@core/Tree';
import { PolygonTreeNode } from '@core/PolygonTreeNode';
export declare class Node {
    parent: Node | null;
    plane: Plane | null;
    front: Node | null;
    back: Node | null;
    polygontreenodes: never[];
    /**
     * Node Constructor
     */
    constructor(parent: Node | null);
    invert(): void;
    clipPolygons(polygontreenodes: PolygonTreeNode[], alsoRemovecoplanarFront?: boolean): void;
    clipTo(tree: Tree, alsoRemovecoplanarFront?: boolean): void;
    addPolygonTreeNodes(polygontreenodes: PolygonTreeNode[]): void;
    getParentPlaneNormals(normals: Vector3[], maxdepth: number): void;
}
//# sourceMappingURL=Node.d.ts.map