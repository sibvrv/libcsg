export type TRAWVectorGlyph = (number | undefined)[];

export interface IVectorFont {
  height: number;

  [charCode: number]: TRAWVectorGlyph;
}

export const enum TEXT_ALIGN {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export interface IVectorTextOptions {
  xOffset: number;
  yOffset: number;
  input: string;
  align: TEXT_ALIGN;
  font: any;
  height: number;
  lineSpacing: number;
  letterSpacing: number;
  extrudeOffset: number;
}

export interface IVectorTextLine {
  width: 0;
  segments: any[];
}
