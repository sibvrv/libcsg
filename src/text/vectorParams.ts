import {hersheyFont as defaultFont} from './fonts/single-line/hershey/simplex';
import {IVectorTextOptions, TEXT_ALIGN} from '@root/text/types/VectorTextTypes';

export const defaultsVectorParams: IVectorTextOptions = {
  xOffset: 0,
  yOffset: 0,
  input: '?',
  align: TEXT_ALIGN.LEFT,
  font: defaultFont,
  height: 14, // == old vector_xxx simplex font height
  lineSpacing: 2.142857142857143, // == 30/14 == old vector_xxx ratio
  letterSpacing: 1,
  extrudeOffset: 0,
};

// vectorsXXX parameters handler
export const vectorParams = (options?: Partial<IVectorTextOptions> | string, input: string = '?') => ({
  ...defaultsVectorParams,
  ...({input}),
  ...(typeof options === 'string' ? {input: options} : options),
});

