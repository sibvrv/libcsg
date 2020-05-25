export const enum ENTITY_TYPE {
  EMPTY_TYPE,

  MODIFIER_TYPE = 1,
  BOOLEAN_UNION = MODIFIER_TYPE,
  BOOLEAN_SUBTRACT,
  BOOLEAN_INTERSECT,
  MODIFIER_LAST = 20 - 1,

  TRANSFORM_TYPE = 20,
  TRANSFORM_OBJECT = TRANSFORM_TYPE,

  TRANSFORM_LAST,

  OBJECT_CAG_TYPE = 50,
  OBJECT_SQUARE = OBJECT_CAG_TYPE,
  OBJECT_CIRCLE,
  OBJECT_POLYGON,
  OBJECT_TRIANGLE, // todo remove it
  OBJECT_CAG_LAST = 70 - 1,

  OBJECT_CSG_TYPE = 100,
  OBJECT_CUBE = OBJECT_CSG_TYPE,
  OBJECT_SPHERE,
  OBJECT_CYLINDER,
  OBJECT_TORUS,
  OBJECT_POLYHEDRON,
  OBJECT_GEODESIC_SPHERE,
  OBJECT_CSG_LAST = 200 - 1,

  UNK_TYPE = 256,
}

export const enum ENTITY_STATUS {
  NEW,
  READY
}

function normalizeArray<T>(...data: any[]): T[] {
  const result: T[] = [];
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < data.length; i++) {
    result.push(...!Array.isArray(data[i]) ? [data[i]] : normalizeArray(...data[i]));
  }
  return result;
}

export type TEntitiesList = (Entity | TEntitiesList | TEntitiesList[])[];
export type TEntities = Entity | TEntitiesList;

export class Entity {
  protected type: ENTITY_TYPE = ENTITY_TYPE.EMPTY_TYPE;
  protected entities: Entity[] = [];
  protected status: ENTITY_STATUS = ENTITY_STATUS.NEW;
  protected arguments: any[] = [];

  constructor(data?: Entity | Entity[]) {
    if (data) {
      this.entities = Array.isArray(data) ? [...data] : [data];
    }
  }

  private setType(type: ENTITY_TYPE) {
    this.type = type;
    return this;
  }

  private setArgs(...args: any[]) {
    this.arguments = args;
    return this;
  }

  static from(data?: Entity | Entity[]) {
    if (data instanceof Entity) {
      return data;
    }

    if (Array.isArray(data)) {
      return new Entity(data);
    }

    return this;
  }

  clone() {
    return new Entity(this);
  }

  union(...objects: TEntities[]) {
    return new Entity(normalizeArray(this, objects)).setType(ENTITY_TYPE.BOOLEAN_UNION);
  }

  static union(...objects: TEntities[]): Entity {
    return new Entity(normalizeArray(objects)).setType(ENTITY_TYPE.BOOLEAN_UNION);
  }

  subtract(...objects: TEntities[]) {
    return new Entity(normalizeArray(this, objects)).setType(ENTITY_TYPE.BOOLEAN_SUBTRACT);
  }

  intersect(...objects: TEntities[]) {
    return new Entity(normalizeArray(this, objects)).setType(ENTITY_TYPE.BOOLEAN_INTERSECT);
  }

  transform(matrix: any) {
    return new Entity().setArgs(matrix).setType(ENTITY_TYPE.TRANSFORM_OBJECT);
  }

  isCSG() {
    return this.type >= ENTITY_TYPE.OBJECT_CSG_TYPE && this.type < ENTITY_TYPE.OBJECT_CSG_LAST;
  }

  isCAG() {
    return this.type >= ENTITY_TYPE.OBJECT_CAG_TYPE && this.type < ENTITY_TYPE.OBJECT_CAG_LAST;
  }

  cube(size: number): Entity;
  cube(...args: any[]): Entity {
    this.type = ENTITY_TYPE.OBJECT_CUBE;
    this.arguments = [...args];
    return this;
  }

  static cube(size: number): Entity {
    return (new Entity()).cube(size);
  }
}
