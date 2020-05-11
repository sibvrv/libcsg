import { IVectorTextLine } from '@root/text/types/VectorTextTypes';
export interface ITranslateLineOptions {
    x: number;
    y: number;
}
/**
 * Translate text line
 * @param options
 * @param line
 */
export declare function translateLine(options: Partial<ITranslateLineOptions>, line: IVectorTextLine): IVectorTextLine;
//# sourceMappingURL=translateLine.d.ts.map