/**
 * Insert Sorted
 * @param array
 * @param element
 * @param comparefunc
 */
export function insertSorted(array: any[], element: any, comparefunc: any) {
  let leftbound = 0;
  let rightbound = array.length;
  while (rightbound > leftbound) {
    const testindex = Math.floor((leftbound + rightbound) / 2);
    const testelement = array[testindex];
    const compareresult = comparefunc(element, testelement);
    if (compareresult > 0) // element > testelement
    {
      leftbound = testindex + 1;
    } else {
      rightbound = testindex;
    }
  }
  array.splice(leftbound, 0, element);
}
