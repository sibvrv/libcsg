// TODO: consider generalization and adding to addTransformationMethodsToPrototype
export const addCenteringToPrototype = (prot: any, axes: any) => {
  prot.center = function(cAxes: any) {
    cAxes = Array.prototype.map.call(arguments, (a) => {
      return a; // .toLowerCase();
    });
    // no args: center on all axes
    if (!cAxes.length) {
      cAxes = axes.slice();
    }
    const b = this.getBounds();
    return this.translate(axes.map((a: any) => cAxes.indexOf(a) > -1 ? -(b[0][a] + b[1][a]) / 2 : 0));
  };
};
