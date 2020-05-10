import {expandedShellOfCCSG} from './expandedShellOfCCSG';
import {expandedShellOfCAG} from './expandedShellOfCAG';
import {isCSG} from '@core/utils/isCSG';

/**
 * Contract
 * @param shape
 * @param radius
 * @param resolution
 */
export const contract = (shape: any, radius: number, resolution: number) => {
  let result;
  if (isCSG(shape)) {
    result = shape.subtract(expandedShellOfCCSG(shape, radius, resolution));
    result = result.reTesselated();
    result.properties = shape.properties; // keep original properties
  } else {
    result = shape.subtract(expandedShellOfCAG(shape, radius, resolution));
  }
  return result;
};
