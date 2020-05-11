/**
 * Parse an option from the options object
 * If the option is not present, return the default value
 * @param options
 * @param optionname
 * @param defaultvalue
 */
export declare const parseOption: (options: any, optionname: string, defaultvalue: any) => any;
/**
 * Parse an option and force into a Vector3. If a scalar is passed it is converted
 * into a vector with equal x,y,z
 * @param options
 * @param optionname
 * @param defaultvalue
 */
export declare const parseOptionAs3DVector: (options: any, optionname: string, defaultvalue: any) => any;
/**
 * Parse an option and force into a Vector3 List.
 * @param options
 * @param optionname
 * @param defaultvalue
 */
export declare const parseOptionAs3DVectorList: (options: any, optionname: string, defaultvalue: any) => any;
/**
 * Parse an option and force into a Vector2. If a scalar is passed it is converted
 * into a vector with equal x,y
 * @param options
 * @param optionname
 * @param defaultvalue
 */
export declare const parseOptionAs2DVector: (options: any, optionname: string, defaultvalue: any) => any;
/**
 * Parse an option and force into a Float.
 * @param options
 * @param optionname
 * @param defaultvalue
 */
export declare const parseOptionAsFloat: (options: any, optionname: string, defaultvalue: any) => number;
/**
 * Parse an option and force into a Integer.
 * @param options
 * @param optionname
 * @param defaultvalue
 */
export declare const parseOptionAsInt: (options: any, optionname: string, defaultvalue: any) => any;
/**
 * Parse an option and force into a Boolean.
 * @param options
 * @param optionname
 * @param defaultvalue
 */
export declare const parseOptionAsBool: (options: any, optionname: string, defaultvalue: any) => any;
//# sourceMappingURL=optionParsers.d.ts.map