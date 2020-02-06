import { arrayClone } from './utility';
import { emptyCell } from './cell';

export const moveUp = (grid, score) => {
  // Rotate and flip direction from up to right
  let newGrid = rotate(arrayClone(grid));
  let newScore = score;
  newGrid = flip(newGrid);

  [newGrid, newScore] = move(newGrid, newScore);

  // Rotate and flip back
  newGrid = flip(newGrid);
  newGrid = translate(newGrid);
  return [newGrid, newScore];
};

export const moveDown = (grid, score) => {
  // Rotate direction from down to right
  let newGrid = arrayClone(grid);
  let newScore = score;
  newGrid = rotate(newGrid);

  [newGrid, newScore] = move(newGrid, newScore);

  // Rotate back
  newGrid = translate(newGrid);
  return [newGrid, newScore];
};

export const moveLeft = (grid, score) => {
  // Flip direction from left to right
  let newGrid = flip(arrayClone(grid));
  let newScore = score;

  [newGrid, newScore] = move(newGrid, newScore);

  // Flip back
  newGrid = flip(newGrid);
  return [newGrid, newScore];
};

export const moveRight = (grid, score) => {
  let newGrid = arrayClone(grid);
  let newScore = score;

  [newGrid, newScore] = move(newGrid, newScore);

  return [newGrid, newScore];
};

const move = (grid, score) => {
  let newGrid = arrayClone(grid);
  let newScore = score;

  newGrid = clearCellsClassNames(newGrid);

  for (let row = 0; row < 4; row++) {
    newGrid[row] = slide(newGrid[row]);
    [newGrid[row], newScore] = merge(newGrid[row], newScore);
    newGrid[row] = slide(newGrid[row]);
  }
  return [newGrid, newScore];
};

const slide = arr => {
  let modifiedArr = arrayClone(arr);

  modifiedArr = modifiedArr.filter(cell => cell.value);
  modifiedArr = modifiedArr.map(cell => {
    if (cell.className === 'move-to-merge') return cell;
    return cell.className === 'merged'
      ? { ...cell, prevRow: cell.row, prevColumn: cell.column }
      : { ...cell, prevRow: cell.row, prevColumn: cell.column, className: 'moved' };
  });

  const zeros = new Array(4 - modifiedArr.length).fill(new emptyCell(0));
  modifiedArr = [...zeros, ...modifiedArr];

  return modifiedArr;
};

const merge = (arr, score) => {
  let modifiedArr = arrayClone(arr);
  let newScore = score;

  for (let i = 3; i > 0; i--) {
    if (modifiedArr[i - 1].value === modifiedArr[i].value) {
      if (!modifiedArr[i].value) continue;

      modifiedArr[i - 1].row = modifiedArr[i].row;
      modifiedArr[i - 1].column = modifiedArr[i].column;
      modifiedArr[i - 1].className = 'move-to-merge';

      modifiedArr[i].value = modifiedArr[i - 1].value * 2;
      modifiedArr[i].prevRow = modifiedArr[i - 1].row;
      modifiedArr[i].prevColumn = modifiedArr[i - 1].column;
      modifiedArr[i].className = 'merged';

      modifiedArr[i - 1].value = 0;
      newScore += modifiedArr[i].value;
    }
  }
  return [modifiedArr, newScore];
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

const clearCellsClassNames = grid => {
  let clearedGrid = arrayClone(grid);
  clearedGrid = clearedGrid.map(row =>
    row.map(cell => (cell.className !== 'empty' ? { ...cell, className: '' } : cell)),
  );
  return clearedGrid;
};
