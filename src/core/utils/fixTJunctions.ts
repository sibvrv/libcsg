// @ts-nocheck
import {EPS} from '@core/constants';
import {Plane, Polygon3} from '@core/math';

function addSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) {
  const starttag = vertex0.getTag();
  const endtag = vertex1.getTag();
  if (starttag === endtag) throw new Error('Assertion failed');
  const newsidetag = starttag + '/' + endtag;
  const reversesidetag = endtag + '/' + starttag;
  if (reversesidetag in sidemap) {
    // we have a matching reverse oriented side.
    // Instead of adding the new side, cancel out the reverse side:
    // console.log("addSide("+newsidetag+") has reverse side:");
    deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex1, vertex0, null);
    return null;
  }
  //  console.log("addSide("+newsidetag+")");
  const newsideobj = {
    vertex0,
    vertex1,
    polygonindex,
  };
  if (!(newsidetag in sidemap)) {
    sidemap[newsidetag] = [newsideobj];
  } else {
    sidemap[newsidetag].push(newsideobj);
  }
  if (starttag in vertextag2sidestart) {
    vertextag2sidestart[starttag].push(newsidetag);
  } else {
    vertextag2sidestart[starttag] = [newsidetag];
  }
  if (endtag in vertextag2sideend) {
    vertextag2sideend[endtag].push(newsidetag);
  } else {
    vertextag2sideend[endtag] = [newsidetag];
  }
  return newsidetag;
}

function deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) {
  const starttag = vertex0.getTag();
  const endtag = vertex1.getTag();
  const sidetag = starttag + '/' + endtag;
  // console.log("deleteSide("+sidetag+")");
  if (!(sidetag in sidemap)) throw new Error('Assertion failed');
  let idx = -1;
  const sideobjs = sidemap[sidetag];
  for (let i = 0; i < sideobjs.length; i++) {
    const sideobj = sideobjs[i];
    if (sideobj.vertex0 !== vertex0) continue;
    if (sideobj.vertex1 !== vertex1) continue;
    if (polygonindex !== null) {
      if (sideobj.polygonindex !== polygonindex) continue;
    }
    idx = i;
    break;
  }
  if (idx < 0) throw new Error('Assertion failed');
  sideobjs.splice(idx, 1);
  if (sideobjs.length === 0) {
    delete sidemap[sidetag];
  }
  idx = vertextag2sidestart[starttag].indexOf(sidetag);
  if (idx < 0) throw new Error('Assertion failed');
  vertextag2sidestart[starttag].splice(idx, 1);
  if (vertextag2sidestart[starttag].length === 0) {
    delete vertextag2sidestart[starttag];
  }

  idx = vertextag2sideend[endtag].indexOf(sidetag);
  if (idx < 0) throw new Error('Assertion failed');
  vertextag2sideend[endtag].splice(idx, 1);
  if (vertextag2sideend[endtag].length === 0) {
    delete vertextag2sideend[endtag];
  }
}

/*
     fixTJunctions:

     Suppose we have two polygons ACDB and EDGF:

      A-----B
      |     |
      |     E--F
      |     |  |
      C-----D--G

     Note that vertex E forms a T-junction on the side BD. In this case some STL slicers will complain
     that the solid is not watertight. This is because the watertightness check is done by checking if
     each side DE is matched by another side ED.

     This function will return a new solid with ACDB replaced by ACDEB

     Note that this can create polygons that are slightly non-convex (due to rounding errors). Therefore the result should
     not be used for further CSG operations!
*/
export const fixTJunctions = (fromPolygons, csg) => {
  csg = csg.canonicalized();
  const sidemap = {};

  // STEP 1
  for (let polygonindex = 0; polygonindex < csg.polygons.length; polygonindex++) {
    const polygon = csg.polygons[polygonindex];
    const numvertices = polygon.vertices.length;
    // should be true
    if (numvertices >= 3) {
      let vertex = polygon.vertices[0];
      let vertextag = vertex.getTag();
      for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
        let nextvertexindex = vertexindex + 1;
        if (nextvertexindex === numvertices) nextvertexindex = 0;
        const nextvertex = polygon.vertices[nextvertexindex];
        const nextvertextag = nextvertex.getTag();
        const sidetag = vertextag + '/' + nextvertextag;
        const reversesidetag = nextvertextag + '/' + vertextag;
        if (reversesidetag in sidemap) {
          // this side matches the same side in another polygon. Remove from sidemap:
          const ar = sidemap[reversesidetag];
          ar.splice(-1, 1);
          if (ar.length === 0) {
            delete sidemap[reversesidetag];
          }
        } else {
          const sideobj = {
            vertex0: vertex,
            vertex1: nextvertex,
            polygonindex,
          };
          if (!(sidetag in sidemap)) {
            sidemap[sidetag] = [sideobj];
          } else {
            sidemap[sidetag].push(sideobj);
          }
        }
        vertex = nextvertex;
        vertextag = nextvertextag;
      }
    }
  }
  // STEP 2
  // now sidemap contains 'unmatched' sides
  // i.e. side AB in one polygon does not have a matching side BA in another polygon
  const vertextag2sidestart = {};
  const vertextag2sideend = {};
  const sidestocheck = {};
  let sidemapisempty = true;

  // tslint:disable-next-line:forin
  for (const sidetag in sidemap) {
    sidemapisempty = false;
    sidestocheck[sidetag] = true;
    sidemap[sidetag].map((sideobj) => {
      const starttag = sideobj.vertex0.getTag();
      const endtag = sideobj.vertex1.getTag();
      if (starttag in vertextag2sidestart) {
        vertextag2sidestart[starttag].push(sidetag);
      } else {
        vertextag2sidestart[starttag] = [sidetag];
      }
      if (endtag in vertextag2sideend) {
        vertextag2sideend[endtag].push(sidetag);
      } else {
        vertextag2sideend[endtag] = [sidetag];
      }
    });
  }

  // STEP 3 : if sidemap is not empty
  if (!sidemapisempty) {
    // make a copy of the polygons array, since we are going to modify it:
    const polygons = csg.polygons.slice(0);
    while (true) {
      // tslint:disable-next-line:no-shadowed-variable
      let sidemapisempty = true;

      // tslint:disable-next-line:forin
      for (const sidetag in sidemap) {
        sidemapisempty = false;
        sidestocheck[sidetag] = true;
      }
      if (sidemapisempty) break;
      let donesomething = false;
      while (true) {
        let sidetagtocheck = null;

        // tslint:disable-next-line:forin
        for (const sidetag in sidestocheck) {
          sidetagtocheck = sidetag;
          break; // FIXME  : say what now ?
        }
        if (sidetagtocheck === null) break; // sidestocheck is empty, we're done!
        let donewithside = true;
        if (sidetagtocheck in sidemap) {
          const sideobjs = sidemap[sidetagtocheck];
          if (sideobjs.length === 0) throw new Error('Assertion failed');
          const sideobj = sideobjs[0];
          for (let directionindex = 0; directionindex < 2; directionindex++) {
            const startvertex = (directionindex === 0) ? sideobj.vertex0 : sideobj.vertex1;
            const endvertex = (directionindex === 0) ? sideobj.vertex1 : sideobj.vertex0;
            const startvertextag = startvertex.getTag();
            const endvertextag = endvertex.getTag();
            let matchingsides = [];
            if (directionindex === 0) {
              if (startvertextag in vertextag2sideend) {
                matchingsides = vertextag2sideend[startvertextag];
              }
            } else {
              if (startvertextag in vertextag2sidestart) {
                matchingsides = vertextag2sidestart[startvertextag];
              }
            }

            // tslint:disable-next-line:prefer-for-of
            for (let matchingsideindex = 0; matchingsideindex < matchingsides.length; matchingsideindex++) {
              const matchingsidetag = matchingsides[matchingsideindex];
              const matchingside = sidemap[matchingsidetag][0];
              const matchingsidestartvertex = (directionindex === 0) ? matchingside.vertex0 : matchingside.vertex1;
              const matchingsideendvertex = (directionindex === 0) ? matchingside.vertex1 : matchingside.vertex0;
              const matchingsidestartvertextag = matchingsidestartvertex.getTag();
              const matchingsideendvertextag = matchingsideendvertex.getTag();
              if (matchingsideendvertextag !== startvertextag) throw new Error('Assertion failed');
              if (matchingsidestartvertextag === endvertextag) {
                // matchingside cancels sidetagtocheck
                deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, startvertex, endvertex, null);
                deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, startvertex, null);
                donewithside = false;
                directionindex = 2; // skip reverse direction check
                donesomething = true;
                break;
              } else {
                const startpos = startvertex.pos;
                const endpos = endvertex.pos;
                const checkpos = matchingsidestartvertex.pos;
                const direction = checkpos.minus(startpos);
                // Now we need to check if endpos is on the line startpos-checkpos:
                const t = endpos.minus(startpos).dot(direction) / direction.dot(direction);
                if ((t > 0) && (t < 1)) {
                  const closestpoint = startpos.plus(direction.times(t));
                  const distancesquared = closestpoint.distanceToSquared(endpos);
                  if (distancesquared < (EPS * EPS)) {
                    // Yes it's a t-junction! We need to split matchingside in two:
                    const polygonindex = matchingside.polygonindex;
                    const polygon = polygons[polygonindex];
                    // find the index of startvertextag in polygon:
                    const insertionvertextag = matchingside.vertex1.getTag();
                    let insertionvertextagindex = -1;
                    for (let i = 0; i < polygon.vertices.length; i++) {
                      if (polygon.vertices[i].getTag() === insertionvertextag) {
                        insertionvertextagindex = i;
                        break;
                      }
                    }
                    if (insertionvertextagindex < 0) throw new Error('Assertion failed');
                    // split the side by inserting the vertex:
                    const newvertices = polygon.vertices.slice(0);
                    newvertices.splice(insertionvertextagindex, 0, endvertex);
                    const newpolygon = new Polygon3(newvertices, polygon.shared /* polygon.plane */);

                    // calculate plane with differents point
                    if (isNaN(newpolygon.plane.w)) {
                      let found = false;
                      const loop = (callback) => {
                        newpolygon.vertices.forEach((item) => {
                          if (found) return;
                          callback(item);
                        });
                      };

                      loop((a) => {
                        loop((b) => {
                          loop((c) => {
                            newpolygon.plane = Plane.fromPoints(a.pos, b.pos, c.pos);
                            if (!isNaN(newpolygon.plane.w)) {
                              found = true;
                            }
                          });
                        });
                      });
                    }
                    polygons[polygonindex] = newpolygon;
                    // remove the original sides from our maps
                    // deleteSide(sideobj.vertex0, sideobj.vertex1, null)
                    deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, matchingside.vertex1, polygonindex);
                    const newsidetag1 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, endvertex, polygonindex);
                    const newsidetag2 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, matchingside.vertex1, polygonindex);
                    if (newsidetag1 !== null) sidestocheck[newsidetag1] = true;
                    if (newsidetag2 !== null) sidestocheck[newsidetag2] = true;
                    donewithside = false;
                    directionindex = 2; // skip reverse direction check
                    donesomething = true;
                    break;
                  } // if(distancesquared < 1e-10)
                } // if( (t > 0) && (t < 1) )
              } // if(endingstidestartvertextag === endvertextag)
            } // for matchingsideindex
          } // for directionindex
        } // if(sidetagtocheck in sidemap)
        if (donewithside) {
          delete sidestocheck[sidetagtocheck];
        }
      }
      if (!donesomething) break;
    }
    const newcsg = fromPolygons(polygons);
    newcsg.properties = csg.properties;
    newcsg.isCanonicalized = true;
    newcsg.isRetesselated = true;
    csg = newcsg;
  }

  // FIXME : what is even the point of this ???
  /* sidemapisempty = true
  for (let sidetag in sidemap) {
    sidemapisempty = false
    break
  }
  */

  return csg;
};

