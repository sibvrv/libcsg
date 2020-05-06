import {Path2D} from '../core/math/Path2';

export const cagoutlinePaths = (_cag) => {
  const cag = _cag.canonicalized();
  const sideTagToSideMap = {};
  const startVertexTagToSideTagMap = {};

  cag.sides.map((side) => {
    const sidetag = side.getTag();
    sideTagToSideMap[sidetag] = side;
    const startvertextag = side.vertex0.getTag();
    if (!(startvertextag in startVertexTagToSideTagMap)) {
      startVertexTagToSideTagMap[startvertextag] = [];
    }
    startVertexTagToSideTagMap[startvertextag].push(sidetag);
  });

  const paths = [];
  while (true) {
    let startsidetag = null;
    for (const aVertexTag in startVertexTagToSideTagMap) {
      const sidesForcagVertex = startVertexTagToSideTagMap[aVertexTag];
      startsidetag = sidesForcagVertex[0];
      sidesForcagVertex.splice(0, 1);
      if (sidesForcagVertex.length === 0) {
        delete startVertexTagToSideTagMap[aVertexTag];
      }
      break;
    }
    if (startsidetag === null) break; // we've had all sides
    const connectedVertexPoints = [];
    const sidetag = startsidetag;
    let cagside = sideTagToSideMap[sidetag];
    const startvertextag = cagside.vertex0.getTag();
    while (true) {
      connectedVertexPoints.push(cagside.vertex0.pos);
      const nextvertextag = cagside.vertex1.getTag();
      if (nextvertextag === startvertextag) break; // we've closed the polygon
      if (!(nextvertextag in startVertexTagToSideTagMap)) {
        throw new Error('Area is not closed!');
      }
      const nextpossiblesidetags = startVertexTagToSideTagMap[nextvertextag];
      let nextsideindex = -1;
      if (nextpossiblesidetags.length === 1) {
        nextsideindex = 0;
      } else {
        // more than one side starting at the same vertex. cag means we have
        // two shapes touching at the same corner
        let bestangle = null;
        const cagangle = cagside.direction().angleDegrees();
        for (let sideindex = 0; sideindex < nextpossiblesidetags.length; sideindex++) {
          const nextpossiblesidetag = nextpossiblesidetags[sideindex];
          const possibleside = sideTagToSideMap[nextpossiblesidetag];
          const angle = possibleside.direction().angleDegrees();
          let angledif = angle - cagangle;
          if (angledif < -180) angledif += 360;
          if (angledif >= 180) angledif -= 360;
          if ((nextsideindex < 0) || (angledif > bestangle)) {
            nextsideindex = sideindex;
            bestangle = angledif;
          }
        }
      }
      const nextsidetag = nextpossiblesidetags[nextsideindex];
      nextpossiblesidetags.splice(nextsideindex, 1);
      if (nextpossiblesidetags.length === 0) {
        delete startVertexTagToSideTagMap[nextvertextag];
      }
      cagside = sideTagToSideMap[nextsidetag];
    } // inner loop
    // due to the logic of fromPoints()
    // move the first point to the last
    if (connectedVertexPoints.length > 0) {
      connectedVertexPoints.push(connectedVertexPoints.shift());
    }
    const path = new Path2D(connectedVertexPoints, true);
    paths.push(path);
  } // outer loop

  return paths;
};

