import { Matrix4x4 } from '@core/math';
export declare class Properties {
    [key: string]: any;
    static transformObj(source: any, result: any, matrix4x4: Matrix4x4): void;
    static cloneObj(source: any, result: any): void;
    static addFrom(result: any, otherproperties: any): void;
    _transform(matrix4x4: Matrix4x4): Properties;
    _merge(otherproperties: any): Properties;
}
//# sourceMappingURL=Properties.d.ts.map