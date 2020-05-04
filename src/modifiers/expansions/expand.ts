import {expandedShellOfCCSG} from './expandedShellOfCCSG';
import {expandedShellOfCAG} from './expandedShellOfCAG';
import {isCSG} from '../../core/utils';

/**
 * Expand
 * @param shape
 * @param radius
 * @param resolution
 */
export const expand = (shape: any, radius: number, resolution: number) => {
  let result;
  if (isCSG(shape)) {
    result = shape.union(expandedShellOfCCSG(shape, radius, resolution));
    result = result.reTesselated();
    result.properties = shape.properties; // keep original properties
  } else {
    result = shape.union(expandedShellOfCAG(shape, radius, resolution));
  }
  return result;
};

