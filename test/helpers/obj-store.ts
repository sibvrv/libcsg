import * as fs from 'fs';
// FIXME: BAD!! tests are supposed to be independant from our CODE !!
import {CSG} from '@core/CSG';
import {CAG} from '@core/CAG';

// import the required modules if necessary

export const getObjectPath = (objectid: string) => `./objects/${objectid}.bin`;

/**
 * Define the basic OBJ
 */
export const OBJ = {
  save(objectid: string, object: any) {
    fs.writeFileSync(getObjectPath(objectid), JSON.stringify(object), 'utf8');
  },

  load(objectid: string) {
    const buffer = fs.readFileSync(getObjectPath(objectid), 'utf8');
    const bin = JSON.parse(buffer);
    if ('sides' in bin) {
      return CAG.fromObject(bin);
    }
    if ('polygons' in bin) {
      return CSG.fromObject(bin);
    }
    throw new Error('Unsupported binary');
  },

  loadPrevious(objectid: string, object: any) {
    let path = './objects/';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    path = getObjectPath(objectid);
    if (!fs.existsSync(path)) {
      OBJ.save(objectid, object);
      return object;
    }
    return OBJ.load(objectid);
  },
};
