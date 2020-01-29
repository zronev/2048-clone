import { arrayClone, arraysEqual } from './utility';
import { emptyCell } from './cell';

export const checkUp = grid => {
  // Rotate and flip direction from up to right
  let newGrid = rotate(arrayClone(grid));
  newGrid = flip(newGrid);

  newGrid = move(newGrid);

  // Rotate and flip back
  newGrid = flip(newGrid);
  newGrid = translate(newGrid);
  return arraysEqual(grid, newGrid);
};

export const checkDown = grid => {
  // Rotate direction from down to right
  let newGrid = arrayClone(grid);
  newGrid = rotate(newGrid);

  newGrid = move(newGrid);

  // Rotate back
  newGrid = translate(newGrid);
  return arraysEqual(grid, newGrid);
};

export const checkLeft = grid => {
  // Flip direction from left to right
  let newGrid = flip(arrayClone(grid));

  newGrid = move(newGrid);

  // Flip back
  newGrid = flip(newGrid);
  return arraysEqual(grid, newGrid);
};

export const checkRight = grid => {
  let newGrid = arrayClone(grid);
  newGrid = move(newGrid);

  return arraysEqual(grid, newGrid);
};

const move = grid => {
  let newGrid = arrayClone(grid);

  for (let row = 0; row < 4; row++) {
    newGrid[row] = slide(newGrid[row]);
    newGrid[row] = merge(newGrid[row]);
    newGrid[row] = slide(newGrid[row]);
  }

  return newGrid;
};

const slide = arr => {
  let modifiedArr = arrayClone(arr);

  modifiedArr = modifiedArr.filter(cell => cell.value);
  modifiedArr = modifiedArr.map(cell =>
    cell.className !== 'merged' ? { ...cell, className: 'moved' } : cell,
  );

  const zeros = new Array(4 - modifiedArr.length).fill(new emptyCell(0));
  modifiedArr = [...zeros, ...modifiedArr];

  return modifiedArr;
};

const merge = arr => {
  let modifiedArr = arrayClone(arr);

  for (let i = 3; i > 0; i--) {
    if (modifiedArr[i - 1].value === modifiedArr[i].value) {
      modifiedArr[i].value = modifiedArr[i - 1].value * 2;
      modifiedArr[i].className = 'merged';
      modifiedArr[i - 1].value = 0;
    }
  }

  return modifiedArr;
};

const flip = grid => {
  let modifiedArr = arrayClone(grid);
  return modifiedArr.map(row => row.reverse());
};

const rotate = grid => {
  let rotatedGrid = arrayClone(grid);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      rotatedGrid[row][col] = grid[col][row];
    }
  }

  return rotatedGrid;
};

const translate = grid => {
  let translatedGrid = arrayClone(grid);

  translatedGrid = rotate(translatedGrid);
  translatedGrid = rotate(translatedGrid);
  translatedGrid = rotate(translatedGrid);

  return translatedGrid;
};
