export class emptyCell {
  constructor() {
    this.value = 0;
    this.className = 'empty';
  }
}

class randomCell {
  constructor() {
    this.row = Math.floor(Math.random() * Math.floor(4));
    this.column = Math.floor(Math.random() * Math.floor(4));
    this.value = Math.random() > 0.9 ? 4 : 2;
    this.className = 'emerged';
  }
}

export const spawnTwoRandomCells = grid => {
  let count = 0;
  while (count < 2) {
    const cell = new randomCell();

    if (!grid[cell.row][cell.column].value) {
      grid[cell.row][cell.column] = cell;
      count++;
    }
  }
};

export const spawnRandomCell = grid => {
  let count = 0;
  while (count < 1) {
    const cell = new randomCell();

    if (!grid[cell.row][cell.column].value) {
      grid[cell.row][cell.column] = cell;
      count++;
    }
  }
};
