export const arrayClone = arr => JSON.parse(JSON.stringify(arr)) // to deep clone matrix

export const arraysEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2)
