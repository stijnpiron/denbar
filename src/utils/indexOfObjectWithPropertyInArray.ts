export const indexOfObjectWithPropertyInArray = (array: any[], prop: string, value: any) => {
  let itemIndex = -1;
  array.forEach((_, index) => {
    debugger;
    if (array[index][prop] === value) {
      itemIndex = index;
    }
  });
  return itemIndex;
};
