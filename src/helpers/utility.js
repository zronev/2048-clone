export const arrayClone = arr => JSON.parse(JSON.stringify(arr)); // to deep clone matrix

export const arraysEqual = (arr1, arr2) => {
  const newArr1 = arr1.map(row => row.map(cell => cell.value))
  const newArr2 = arr2.map(row => row.map(cell => cell.value))

  return JSON.stringify(newArr1) === JSON.stringify(newArr2);
};
