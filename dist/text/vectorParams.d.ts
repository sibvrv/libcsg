import { IVectorTextOptions, TEXT_ALIGN } from '@root/text/types/VectorTextTypes';
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