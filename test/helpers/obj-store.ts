import * as fs from 'fs'
import {CSG, CAG} from '../../src/csg' // FIXME: BAD!! tests are supposed to be independant from our CODE !!

// import the required modules if necessary

// //////////////////////////////////////////
// define the basic OBJ
// //////////////////////////////////////////
export const OBJ: any = {}

function _path (objectid: string) {
  return './objects/' + objectid + '.bin'
}

OBJ.save = (objectid: any, object: any) => {
  fs.writeFileSync(_path(objectid), JSON.stringify(object), 'utf8')
}

OBJ.load =  (objectid: any) => {
  const buffer = fs.readFileSync(_path(objectid), 'utf8')
  const bin = JSON.parse(buffer)
  if ('sides' in bin) {
    return CAG.fromObject(bin)
  }
  if ('polygons' in bin) {
    return CSG.fromObject(bin)
  }
  throw new Error('Unsupported binary')
}

OBJ.loadPrevious =  (objectid: any, object: any) => {
  let path = './objects/'
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  path = _path(objectid)
  if (!fs.existsSync(path)) {
    OBJ.save(objectid, object)
    return object
  }
  return OBJ.load(objectid)
}
