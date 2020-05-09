import {IVectorTextLine} from './vectorText';

export interface ITranslateLineOptions {
  x: number;
  y: number;
}

const defaults: ITranslateLineOptions = {
  x: 0,
  y: 0,
};

/**
 * Translate text line
 * @param options
 * @param line
 */
export function translateLine(options: Partial<ITranslateLineOptions>, line: IVectorTextLine) {
  const {x, y} = {...defaults, ...options};
  const segments = line.segments;

  for (let i = 0, il = segments.length; i < il; i++) {
    const segment = segments[i];
    for (let j = 0, jl = segment.length; j < jl; j++) {
      const point = segment[j];
      segment[j] = [point[0] + x, point[1] + y];
    }
  }
  return line;
}
