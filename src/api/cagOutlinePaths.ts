import {Path2D, Side, Vector2} from '@core/math';
import {CAG} from '@core/CAG';

/**
 * Cag Outline Paths
 * @param _cag
 */
export const cagOutlinePaths = (_cag: CAG) => {
  const cag = _cag.canonicalized();

  const sideTagToSideMap: {
    [hash: number]: Side;
  } = {};

  const startVertexTagToSideTagMap: {
    [hash: number]: number[]
  } = {};

  cag.sides.map((side: Side) => {
    const sideTag = side.getTag();
    sideTagToSideMap[sideTag] = side;
    const startVertexTag = side.vertex0.getTag();

    if (!(startVertexTag in startVertexTagToSideTagMap)) {
      startVertexTagToSideTagMap[startVertexTag] = [];
    }

    startVertexTagToSideTagMap[startVertexTag].push(sideTag);
  });

  const paths: Path2D[] = [];
  while (true) {
    let startSideTag = null;

    // tslint:disable-next-line:forin
    for (const aVertexTag in startVertexTagToSideTagMap) {
      const sidesForcagVertex = startVertexTagToSideTagMap[aVertexTag];
      startSideTag = sidesForcagVertex[0];
      sidesForcagVertex.splice(0, 1);
      if (sidesForcagVertex.length === 0) {
        delete startVertexTagToSideTagMap[aVertexTag];
      }
      break;
    }

    if (startSideTag === null) {
      break; // we've had all sides
    }

    const connectedVertexPoints: Vector2[] = [];
    const sideTag = startSideTag;

    let cagSide = sideTagToSideMap[sideTag];
    const startVertexTag = cagSide.vertex0.getTag();
    while (true) {
      connectedVertexPoints.push(cagSide.vertex0.pos);
      const nextVertexTag = cagSide.vertex1.getTag();

      if (nextVertexTag === startVertexTag) {
        break; // we've closed the polygon
      }

      if (!(nextVertexTag in startVertexTagToSideTagMap)) {
        throw new Error('Area is not closed!');
      }

      const nextPossibleSideTags = startVertexTagToSideTagMap[nextVertexTag];

      let nextSideIndex = -1;

      if (nextPossibleSideTags.length === 1) {
        nextSideIndex = 0;
      } else {
        // more than one side starting at the same vertex. cag means we have
        // two shapes touching at the same corner

        let bestAngle = null;

        const cagAngle = cagSide.direction().angleDegrees();
        for (let sideIndex = 0; sideIndex < nextPossibleSideTags.length; sideIndex++) {
          const nextPossibleSideTag = nextPossibleSideTags[sideIndex];
          const possibleside = sideTagToSideMap[nextPossibleSideTag];
          const angle = possibleside.direction().angleDegrees();

          let angleDiff = angle - cagAngle;

          if (angleDiff < -180) angleDiff += 360;
          if (angleDiff >= 180) angleDiff -= 360;

          if ((nextSideIndex < 0) || bestAngle === null || (angleDiff > bestAngle)) {
            nextSideIndex = sideIndex;
            bestAngle = angleDiff;
          }
        }
      }

      const nextSideTag = nextPossibleSideTags[nextSideIndex];

      nextPossibleSideTags.splice(nextSideIndex, 1);
      if (nextPossibleSideTags.length === 0) {
        delete startVertexTagToSideTagMap[nextVertexTag];
      }

      cagSide = sideTagToSideMap[nextSideTag];
    }

    // due to the logic of fromPoints() move the first point to the last
    if (connectedVertexPoints.length > 0) {
      connectedVertexPoints.push(connectedVertexPoints.shift()!);
    }

    const path = new Path2D(connectedVertexPoints, true);
    paths.push(path);
  }

  return paths;
};

