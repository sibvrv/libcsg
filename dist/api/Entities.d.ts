export declare const enum ENTITY_TYPE {
    EMPTY_TYPE = 0,
    MODIFIER_TYPE = 1,
    BOOLEAN_UNION = 1,
    BOOLEAN_SUBTRACT = 2,
    BOOLEAN_INTERSECT = 3,
    MODIFIER_LAST = 19,
    TRANSFORM_TYPE = 20,
    TRANSFORM_OBJECT = 20,
    TRANSFORM_LAST = 21,
    OBJECT_CAG_TYPE = 50,
    OBJECT_SQUARE = 50,
    OBJECT_CIRCLE = 51,
    OBJECT_POLYGON = 52,
    OBJECT_TRIANGLE = 53,
    OBJECT_CAG_LAST = 69,
    OBJECT_CSG_TYPE = 100,
    OBJECT_CUBE = 100,
    OBJECT_SPHERE = 101,
    OBJECT_CYLINDER = 102,
    OBJECT_TORUS = 103,
    OBJECT_POLYHEDRON = 104,
    OBJECT_GEODESIC_SPHERE = 105,
    OBJECT_CSG_LAST = 199,
    UNK_TYPE = 256
}
export declare const enum ENTITY_STATUS {
    NEW = 0,
    READY = 1
}
export declare type TEntitiesList = (Entity | TEntitiesList | TEntitiesList[])[];
export declare type TEntities = Entity | TEntitiesList;
export declare class Entity {
    protected type: ENTITY_TYPE;
    protected entities: Entity[];
    protected status: ENTITY_STATUS;
    protected arguments: any[];
    constructor(data?: Entity | Entity[]);
    private setType;
    private setArgs;
    static from(data?: Entity | Entity[]): Entity | typeof Entity;
    clone(): Entity;
    union(...objects: TEntities[]): Entity;
    static union(...objects: TEntities[]): Entity;
    subtract(...objects: TEntities[]): Entity;
    intersect(...objects: TEntities[]): Entity;
    transform(matrix: any): Entity;
    isCSG(): boolean;
    isCAG(): boolean;
    cube(size: number): Entity;
    static cube(size: number): Entity;
}
//# sourceMappingURL=Entities.d.ts.map