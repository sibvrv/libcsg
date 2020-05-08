import {EPS} from '../constants';
import {OrthoNormalBasis} from './OrthoNormalBasis';
import {interpolateBetween2DPointsForY, insertSorted, fnNumberSort} from '../utils';
import {Vertex3} from './Vertex3';
import {Vector2} from './Vector2';
import {Line2D} from './Line2';
import {Polygon3} from './Polygon3';
import {calcInterpolationFactor} from './calcInterpolationFactor';

// Retesselation function for a set of coplanar polygons. See the introduction at the top of
// this file.
export const reTesselateCoplanarPolygons = (sourcepolygons: Polygon3[], destpolygons: Polygon3[]) => {
  const numpolygons = sourcepolygons.length;
  if (numpolygons > 0) {
    const plane = sourcepolygons[0].plane;
    const shared = sourcepolygons[0].shared;
    const orthobasis = new OrthoNormalBasis(plane);
    const polygonvertices2d = []; // array of array of Vector2D
    const polygonuvcoordinates = []; // array of array of Vector2D
    const polygontopvertexindexes = []; // array of indexes of topmost vertex per polygon
    const topy2polygonindexes = {};
    const ycoordinatetopolygonindexes = {};

    const xcoordinatebins = {};
    const ycoordinatebins = {};

    // convert all polygon vertices to 2D
    // Make a list of all encountered y coordinates
    // And build a map of all polygons that have a vertex at a certain y coordinate:
    const ycoordinateBinningFactor = 1.0 / EPS * 10;
    for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
      const poly3d = sourcepolygons[polygonindex];
      let vertices2d = [];
      let uvcoordinates = [];
      let numvertices = poly3d.vertices.length;
      let minindex = -1;
      if (numvertices > 0) {
        let miny;
        let maxy;
        let maxindex;
        for (let i = 0; i < numvertices; i++) {
          let pos2d = orthobasis.to2D(poly3d.vertices[i].pos);
          const uvcoordinate = poly3d.vertices[i].uv;
          // perform binning of y coordinates: If we have multiple vertices very
          // close to each other, give them the same y coordinate:
          const ycoordinatebin = Math.floor(pos2d.y * ycoordinateBinningFactor);
          let newy;
          if (ycoordinatebin in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin];
          } else if (ycoordinatebin + 1 in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin + 1];
          } else if (ycoordinatebin - 1 in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin - 1];
          } else {
            newy = pos2d.y;
            ycoordinatebins[ycoordinatebin] = pos2d.y;
          }
          pos2d = Vector2.Create(pos2d.x, newy);
          vertices2d.push(pos2d);
          uvcoordinates.push(uvcoordinate);
          const y = pos2d.y;
          if ((i === 0) || (y < miny)) {
            miny = y;
            minindex = i;
          }
          if ((i === 0) || (y > maxy)) {
            maxy = y;
            maxindex = i;
          }
          if (!(y in ycoordinatetopolygonindexes)) {
            ycoordinatetopolygonindexes[y] = {};
          }
          ycoordinatetopolygonindexes[y][polygonindex] = true;
        }
        if (miny >= maxy) {
          // degenerate polygon, all vertices have same y coordinate. Just ignore it from now:
          vertices2d = [];
          uvcoordinates = [];
          numvertices = 0;
          minindex = -1;
        } else {
          if (!(miny in topy2polygonindexes)) {
            topy2polygonindexes[miny] = [];
          }
          topy2polygonindexes[miny].push(polygonindex);
        }
      } // if(numvertices > 0)
      // reverse the vertex order:
      vertices2d.reverse();
      uvcoordinates.reverse();
      minindex = numvertices - minindex - 1;
      polygonvertices2d.push(vertices2d);
      polygonuvcoordinates.push(uvcoordinates);
      polygontopvertexindexes.push(minindex);
    }
    const ycoordinates = [];
    for (const ycoordinate in ycoordinatetopolygonindexes) ycoordinates.push(ycoordinate);
    ycoordinates.sort(fnNumberSort);

    // Now we will iterate over all y coordinates, from lowest to highest y coordinate
    // activepolygons: source polygons that are 'active', i.e. intersect with our y coordinate
    //   Is sorted so the polygons are in left to right order
    // Each element in activepolygons has these properties:
    //        polygonindex: the index of the source polygon (i.e. an index into the sourcepolygons
    //                      and polygonvertices2d arrays)
    //        leftvertexindex: the index of the vertex at the left side of the polygon (lowest x)
    //                         that is at or just above the current y coordinate
    //        rightvertexindex: dito at right hand side of polygon
    //        topleft, bottomleft: coordinates of the left side of the polygon crossing the current y coordinate
    //        topright, bottomright: coordinates of the right hand side of the polygon crossing the current y coordinate
    let activepolygons = [];
    let prevoutpolygonrow = [];
    for (let yindex = 0; yindex < ycoordinates.length; yindex++) {
      const newoutpolygonrow = [];
      const ycoordinate_as_string = ycoordinates[yindex];
      const ycoordinate = Number(ycoordinate_as_string);

      // update activepolygons for this y coordinate:
      // - Remove any polygons that end at this y coordinate
      // - update leftvertexindex and rightvertexindex (which point to the current vertex index
      //   at the the left and right side of the polygon
      // Iterate over all polygons that have a corner at this y coordinate:
      const polygonindexeswithcorner = ycoordinatetopolygonindexes[ycoordinate_as_string];
      for (let activepolygonindex = 0; activepolygonindex < activepolygons.length; ++activepolygonindex) {
        const activepolygon = activepolygons[activepolygonindex];
        const polygonindex = activepolygon.polygonindex;
        if (polygonindexeswithcorner[polygonindex]) {
          // this active polygon has a corner at this y coordinate:
          const vertices2d = polygonvertices2d[polygonindex];
          const uvcoordinates = polygonuvcoordinates[polygonindex];
          const numvertices = vertices2d.length;
          let newleftvertexindex = activepolygon.leftvertexindex;
          let newrightvertexindex = activepolygon.rightvertexindex;
          // See if we need to increase leftvertexindex or decrease rightvertexindex:
          while (true) {
            let nextleftvertexindex = newleftvertexindex + 1;
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
            if (vertices2d[nextleftvertexindex].y !== ycoordinate) break;
            newleftvertexindex = nextleftvertexindex;
          }
          let nextrightvertexindex = newrightvertexindex - 1;
          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1;
          if (vertices2d[nextrightvertexindex].y === ycoordinate) {
            newrightvertexindex = nextrightvertexindex;
          }
          if ((newleftvertexindex !== activepolygon.leftvertexindex) && (newleftvertexindex === newrightvertexindex)) {
            // We have increased leftvertexindex or decreased rightvertexindex, and now they point to the same vertex
            // This means that this is the bottom point of the polygon. We'll remove it:
            activepolygons.splice(activepolygonindex, 1);
            --activepolygonindex;
          } else {
            activepolygon.leftvertexindex = newleftvertexindex;
            activepolygon.rightvertexindex = newrightvertexindex;
            activepolygon.topleft = vertices2d[newleftvertexindex];
            activepolygon.topleftuv = uvcoordinates[newleftvertexindex];
            activepolygon.topright = vertices2d[newrightvertexindex];
            activepolygon.toprightuv = uvcoordinates[newrightvertexindex];
            let nextleftvertexindex = newleftvertexindex + 1;
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
            activepolygon.bottomleft = vertices2d[nextleftvertexindex];
            activepolygon.bottomleftuv = uvcoordinates[nextleftvertexindex];
            let nextrightvertexindex = newrightvertexindex - 1;
            if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1;
            activepolygon.bottomright = vertices2d[nextrightvertexindex];
            activepolygon.bottomrightuv = uvcoordinates[nextrightvertexindex];
          }
        } // if polygon has corner here
      } // for activepolygonindex
      let nextycoordinate;
      if (yindex >= ycoordinates.length - 1) {
        // last row, all polygons must be finished here:
        activepolygons = [];
        nextycoordinate = null;
      } else // yindex < ycoordinates.length-1
      {
        nextycoordinate = Number(ycoordinates[yindex + 1]);
        const middleycoordinate = 0.5 * (ycoordinate + nextycoordinate);
        // update activepolygons by adding any polygons that start here:
        const startingpolygonindexes = topy2polygonindexes[ycoordinate_as_string];
        for (const polygonindex_key in startingpolygonindexes) {
          const polygonindex = startingpolygonindexes[polygonindex_key];
          const vertices2d = polygonvertices2d[polygonindex];
          const uvcoordinates = polygonuvcoordinates[polygonindex];
          const numvertices = vertices2d.length;
          const topvertexindex = polygontopvertexindexes[polygonindex];
          // the top of the polygon may be a horizontal line. In that case topvertexindex can point to any point on this line.
          // Find the left and right topmost vertices which have the current y coordinate:
          let topleftvertexindex = topvertexindex;
          while (true) {
            let i = topleftvertexindex + 1;
            if (i >= numvertices) i = 0;
            if (vertices2d[i].y !== ycoordinate) break;
            if (i === topvertexindex) break; // should not happen, but just to prevent endless loops
            topleftvertexindex = i;
          }
          let toprightvertexindex = topvertexindex;
          while (true) {
            let i = toprightvertexindex - 1;
            if (i < 0) i = numvertices - 1;
            if (vertices2d[i].y !== ycoordinate) break;
            if (i === topleftvertexindex) break; // should not happen, but just to prevent endless loops
            toprightvertexindex = i;
          }
          let nextleftvertexindex = topleftvertexindex + 1;
          if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
          let nextrightvertexindex = toprightvertexindex - 1;
          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1;
          const newactivepolygon = {
            polygonindex,
            leftvertexindex: topleftvertexindex,
            rightvertexindex: toprightvertexindex,
            topleft: vertices2d[topleftvertexindex],
            topleftuv: uvcoordinates[topleftvertexindex],
            topright: vertices2d[toprightvertexindex],
            toprightuv: uvcoordinates[toprightvertexindex],
            bottomleft: vertices2d[nextleftvertexindex],
            bottomleftuv: uvcoordinates[nextleftvertexindex],
            bottomright: vertices2d[nextrightvertexindex],
            bottomrightuv: uvcoordinates[nextrightvertexindex]
          };
          insertSorted(activepolygons, newactivepolygon, function (el1, el2) {
            const x1 = interpolateBetween2DPointsForY(
              el1.topleft, el1.bottomleft, middleycoordinate);
            const x2 = interpolateBetween2DPointsForY(
              el2.topleft, el2.bottomleft, middleycoordinate);
            if (x1 > x2) return 1;
            if (x1 < x2) return -1;
            return 0;
          });
        } // for(let polygonindex in startingpolygonindexes)
      } //  yindex < ycoordinates.length-1
      // if( (yindex === ycoordinates.length-1) || (nextycoordinate - ycoordinate > EPS) )
      if (true) {
        // Now activepolygons is up to date
        // Build the output polygons for the next row in newoutpolygonrow:
        for (const activepolygonKey in activepolygons) {
          const activepolygon = activepolygons[activepolygonKey];
          const polygonindex = activepolygon.polygonindex;
          const vertices2d = polygonvertices2d[polygonindex];
          const numvertices = vertices2d.length;

          let x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, ycoordinate);
          const topleft = Vector2.Create(x, ycoordinate);
          const topleftuv = activepolygon.topleftuv.lerp(activepolygon.bottomleftuv,
            calcInterpolationFactor(activepolygon.topleft,
              activepolygon.bottomleft,
              topleft));
          x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, ycoordinate);
          const topright = Vector2.Create(x, ycoordinate);
          const toprightuv = activepolygon.toprightuv.lerp(activepolygon.bottomrightuv,
            calcInterpolationFactor(activepolygon.topright,
              activepolygon.bottomright,
              topright));
          x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate);
          const bottomleft = Vector2.Create(x, nextycoordinate);
          const bottomleftuv = activepolygon.topleftuv.lerp(activepolygon.bottomleftuv,
            calcInterpolationFactor(activepolygon.topleft,
              activepolygon.bottomleft,
              bottomleft));
          x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, nextycoordinate);
          const bottomright = Vector2.Create(x, nextycoordinate);
          const bottomrightuv = activepolygon.toprightuv.lerp(activepolygon.bottomrightuv,
            calcInterpolationFactor(activepolygon.topright,
              activepolygon.bottomright,
              bottomright));
          const outpolygon = {
            topleft,
            topleftuv,
            topright,
            toprightuv,
            bottomleft,
            bottomleftuv,
            bottomright,
            bottomrightuv,
            leftline: Line2D.fromPoints(topleft, bottomleft),
            rightline: Line2D.fromPoints(bottomright, topright)
          };
          if (newoutpolygonrow.length > 0) {
            const prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1];
            const d1 = outpolygon.topleft.distanceTo(prevoutpolygon.topright);
            const d2 = outpolygon.bottomleft.distanceTo(prevoutpolygon.bottomright);
            if ((d1 < EPS) && (d2 < EPS)) {
              // we can join this polygon with the one to the left:
              outpolygon.topleft = prevoutpolygon.topleft;
              outpolygon.topleftuv = prevoutpolygon.topleftuv;
              outpolygon.leftline = prevoutpolygon.leftline;
              outpolygon.bottomleft = prevoutpolygon.bottomleft;
              outpolygon.bottomleftuv = prevoutpolygon.bottomleftuv;
              newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1);
            }
          }
          newoutpolygonrow.push(outpolygon);
        } // for(activepolygon in activepolygons)
        if (yindex > 0) {
          // try to match the new polygons against the previous row:
          const prevcontinuedindexes = {};
          const matchedindexes = {};
          for (let i = 0; i < newoutpolygonrow.length; i++) {
            const thispolygon = newoutpolygonrow[i];
            for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
              if (!matchedindexes[ii]) // not already processed?
              {
                // We have a match if the sidelines are equal or if the top coordinates
                // are on the sidelines of the previous polygon
                const prevpolygon = prevoutpolygonrow[ii];
                if (prevpolygon.bottomleft.distanceTo(thispolygon.topleft) < EPS) {
                  if (prevpolygon.bottomright.distanceTo(thispolygon.topright) < EPS) {
                    // Yes, the top of this polygon matches the bottom of the previous:
                    matchedindexes[ii] = true;
                    // Now check if the joined polygon would remain convex:
                    const d1 = thispolygon.leftline.direction().x - prevpolygon.leftline.direction().x;
                    const d2 = thispolygon.rightline.direction().x - prevpolygon.rightline.direction().x;
                    const leftlinecontinues = Math.abs(d1) < EPS;
                    const rightlinecontinues = Math.abs(d2) < EPS;
                    const leftlineisconvex = leftlinecontinues || (d1 >= 0);
                    const rightlineisconvex = rightlinecontinues || (d2 >= 0);
                    if (leftlineisconvex && rightlineisconvex) {
                      // yes, both sides have convex corners:
                      // This polygon will continue the previous polygon
                      thispolygon.outpolygon = prevpolygon.outpolygon;
                      thispolygon.leftlinecontinues = leftlinecontinues;
                      thispolygon.rightlinecontinues = rightlinecontinues;
                      prevcontinuedindexes[ii] = true;
                    }
                    break;
                  }
                }
              } // if(!prevcontinuedindexes[ii])
            } // for ii
          } // for i
          for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
            if (!prevcontinuedindexes[ii]) {
              // polygon ends here
              // Finish the polygon with the last point(s):
              const prevpolygon = prevoutpolygonrow[ii];
              prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright);
              prevpolygon.outpolygon.rightuvcoordinates.push(prevpolygon.bottomrightuv);
              if (prevpolygon.bottomright.distanceTo(prevpolygon.bottomleft) > EPS) {
                // polygon ends with a horizontal line:
                prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft);
                prevpolygon.outpolygon.leftuvcoordinates.push(prevpolygon.bottomleftuv);
              }
              // reverse the left half so we get a counterclockwise circle:
              prevpolygon.outpolygon.leftpoints.reverse();
              prevpolygon.outpolygon.leftuvcoordinates.reverse();
              const points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints);
              const uvcoordinates = prevpolygon.outpolygon.rightuvcoordinates.concat(prevpolygon.outpolygon.leftuvcoordinates);
              const vertices3d = [];
              points2d.map(function (point2d, i) {
                const point3d = orthobasis.to3D(point2d);
                const vertex3d = Vertex3.fromPosAndUV(point3d, uvcoordinates[i]);
                vertices3d.push(vertex3d);
              });
              const polygon = new Polygon3(vertices3d, shared, plane);
              destpolygons.push(polygon);
            }
          }
        }

        for (let i = 0; i < newoutpolygonrow.length; i++) {
          const thispolygon = newoutpolygonrow[i];
          if (!thispolygon.outpolygon) {
            // polygon starts here:
            thispolygon.outpolygon = {
              leftpoints: [],
              leftuvcoordinates: [],
              rightpoints: [],
              rightuvcoordinates: []
            };
            thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
            thispolygon.outpolygon.leftuvcoordinates.push(thispolygon.topleftuv);
            if (thispolygon.topleft.distanceTo(thispolygon.topright) > EPS) {
              // we have a horizontal line at the top:
              thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
              thispolygon.outpolygon.rightuvcoordinates.push(thispolygon.toprightuv);
            }
          } else {
            // continuation of a previous row
            if (!thispolygon.leftlinecontinues) {
              thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
              thispolygon.outpolygon.leftuvcoordinates.push(thispolygon.topleftuv);
            }
            if (!thispolygon.rightlinecontinues) {
              thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
              thispolygon.outpolygon.rightuvcoordinates.push(thispolygon.toprightuv);
            }
          }
        }

        prevoutpolygonrow = newoutpolygonrow;
      }
    }
  }
};

