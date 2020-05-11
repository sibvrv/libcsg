import { Matrix4x4 } from '@core/math';
/**
 * @class Properties
 * This class is used to store properties of a solid
 * A property can for example be a Vertex, a Plane or a Line3D
 * Whenever an affine transform is applied to the CSG solid, all its properties are
 * transformed as well.
 * The properties can be stored in a complex nested structure (using arrays and objects)
 */
export declare class Properties {
    [key: string]: any;
    /**
     * Transform Obj
     * @param source
     * @param result
     * @param matrix4x4
     */
    static transformObj(source: any, result: any, matrix4x4: Matrix4x4): void;
    /**
     * Clone Obj
     * @param source
     * @param result
     */
    static cloneObj(source: any, result: any): void;
    /**
     * Add From
     * @param result
     * @param otherproperties
     */
    static addFrom(result: any, otherproperties: any): void;
    /**
     * Transform helper
     * @param matrix4x4
     * @private
     */
    _transform(matrix4x4: Matrix4x4): Properties;
    /**
     * Merge helper
     * @param otherproperties
     * @private
     */
    _merge(otherproperties: any): Properties;
}
//# sourceMappingURL=Properties.d.ts.map