import {Vector3} from './Vector3';
import {Vector2} from './Vector2';

function calcInterpolationFactor(pointa: Vector2, pointb: Vector2, intermediatePoint: Vector2): number;
function calcInterpolationFactor(pointa: Vector3, pointb: Vector3, intermediatePoint: Vector3): number;
function calcInterpolationFactor(pointa: any, pointb: any, intermediatePoint: any): number {
  return pointa.distanceTo(intermediatePoint) / pointa.distanceTo(pointb);
}

export {calcInterpolationFactor};