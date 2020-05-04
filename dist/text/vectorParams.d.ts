export declare type TRAWVectorGlyph = (number | undefined)[];
export interface IVectorFont {
    height: number;
    [charCode: number]: TRAWVectorGlyph;
}
export declare const enum TEXT_ALIGN {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center"
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
export declare const defaultsVectorParams: IVectorTextOptions;
export declare const vectorParams: (options?: string | Partial<IVectorTextOptions> | undefined, input?: string) => {
    input: string;
    xOffset: number;
    yOffset: number;
    align: TEXT_ALIGN;
    font: any;
    height: number;
    lineSpacing: number;
    letterSpacing: number;
    extrudeOffset: number;
} | {
    xOffset: number;
    yOffset: number;
    input: string;
    align: TEXT_ALIGN;
    font: any;
    height: number;
    lineSpacing: number;
    letterSpacing: number;
    extrudeOffset: number;
};
//# sourceMappingURL=vectorParams.d.ts.map