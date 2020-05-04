import {IVectorTextOptions, TEXT_ALIGN, vectorParams} from './vectorParams';
import {vectorChar} from './vectorChar';
import {translateLine} from './translateLine';

export interface IVectorTextLine {
  width: 0;
  segments: any[];
}

/**
 * Construct an array of character segments from a ascii string whose characters code is between 31 and 127,
 * if one character is not supported it is replaced by a question mark.
 * @param {Object|String} [options] - options for construction or ascii string
 * @param {number} [options.xOffset=0] - x offset
 * @param {number} [options.yOffset=0] - y offset
 * @param {number} [options.height=21] - font size (uppercase height)
 * @param {number} [options.lineSpacing=1.4] - line spacing expressed as a percentage of font size
 * @param {number} [options.letterSpacing=1] - extra letter spacing expressed as a percentage of font size
 * @param {String} [options.align='left'] - multi-line text alignement: left, center or right
 * @param {number} [options.extrudeOffset=0] - width of the extrusion that will be applied (manually) after the creation of the character
 * @param {String} [options.input='?'] - ascii string (ignored/overwrited if provided as seconds parameter)
 * @param {String} [text='?'] - ascii string
 * @returns {Array} characters segments [[[x, y], ...], ...]
 *
 * @example
 * let textSegments = vectorText()
 * or
 * let textSegments = vectorText('OpenJSCAD')
 * or
 * let textSegments = vectorText({ yOffset: -50 }, 'OpenJSCAD')
 * or
 * let textSegments = vectorText({ yOffset: -80, input: 'OpenJSCAD' })
 */
export function vectorText(options?: Partial<IVectorTextOptions> | string, text: string = '?') {
  const {
    xOffset, yOffset, input, font, height, align, extrudeOffset, lineSpacing, letterSpacing,
  } = vectorParams(options, text);
  let [x, y] = [xOffset, yOffset];

  let line: IVectorTextLine = {width: 0, segments: []};
  const lines: IVectorTextLine[] = [];

  let output: any[] = [];
  let maxWidth = 0;
  const lineStart = x;
  const pushLine = () => {
    lines.push(line);
    maxWidth = Math.max(maxWidth, line.width);
    line = {width: 0, segments: []};
  };

  for (let i = 0, il = input.length; i < il; i++) {
    const char = input[i];
    const vect = vectorChar({xOffset: x, yOffset: y, font, height, extrudeOffset}, char);
    if (char === '\n') {
      x = lineStart;
      y -= vect.height * lineSpacing;
      pushLine();
      continue;
    }
    const width = vect.width * letterSpacing;
    line.width += width;
    x += width;
    if (char !== ' ') {
      line.segments = line.segments.concat(vect.segments);
    }
  }

  if (line.segments.length) {
    pushLine();
  }

  for (let i = 0, il = lines.length; i < il; i++) {
    line = lines[i];
    if (maxWidth > line.width) {
      const diff = maxWidth - line.width;
      if (align === TEXT_ALIGN.RIGHT) {
        line = translateLine({x: diff}, line);
      } else if (align === TEXT_ALIGN.CENTER) {
        line = translateLine({x: diff / 2}, line);
      }
    }
    output = output.concat(line.segments);
  }
  return output;
}
