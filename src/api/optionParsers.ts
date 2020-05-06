// @ts-nocheck

import {Vector3} from '../core/math/Vector3';
import {Vector2} from '../core/math/Vector2';

// Parse an option from the options object
// If the option is not present, return the default value
export const parseOption = (options: any, optionname: string, defaultvalue: any) => {
  let result = defaultvalue;
  if (options && optionname in options) {
    result = options[optionname];
  }
  return result;
};

// Parse an option and force into a Vector3. If a scalar is passed it is converted
// into a vector with equal x,y,z
export const parseOptionAs3DVector = (options: any, optionname: string, defaultvalue: any) => {
  let result = parseOption(options, optionname, defaultvalue);
  result = new Vector3(result);
  return result;
};

export const parseOptionAs3DVectorList = (options: any, optionname: string, defaultvalue: any) => {
  const result = parseOption(options, optionname, defaultvalue);
  return result.map((res: any) => {
    return new Vector3(res);
  });
};

// Parse an option and force into a Vector2. If a scalar is passed it is converted
// into a vector with equal x,y
export const parseOptionAs2DVector = (options: any, optionname: string, defaultvalue: any) => {
  let result = parseOption(options, optionname, defaultvalue);
  result = new Vector2(result);
  return result;
};

export const parseOptionAsFloat = (options: any, optionname: string, defaultvalue: any) => {
  let result = parseOption(options, optionname, defaultvalue);
  if (typeof (result) === 'string') {
    result = Number(result);
  }
  if (isNaN(result) || typeof (result) !== 'number') {
    throw new Error('Parameter ' + optionname + ' should be a number');
  }
  return result;
};

export const parseOptionAsInt = (options: any, optionname: string, defaultvalue: any) => {
  let result = parseOption(options, optionname, defaultvalue);
  result = Number(Math.floor(result));
  if (isNaN(result)) {
    throw new Error('Parameter ' + optionname + ' should be a number');
  }
  return result;
};

export const parseOptionAsBool = (options: any, optionname: string, defaultvalue: any) => {
  let result = parseOption(options, optionname, defaultvalue);
  if (typeof (result) === 'string') {
    if (result === 'true') result = true;
    else if (result === 'false') result = false;
    else if (result === '0') result = false;
  }
  result = !!result;
  return result;
};
