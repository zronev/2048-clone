class randomCell {
  constructor() {
    this.row = Math.floor(Math.random() * Math.floor(4))
    this.column = Math.floor(Math.random() * Math.floor(4))
    this.value = Math.random() > 0.9 ? 4 : 2
  }
}

export const spawnTwoRandomCells = grid => {
  let count = 0
  while (count < 2) {
    const cell = new randomCell()

    if (!grid[cell.row][cell.column]) {
      grid[cell.row][cell.column] = cell.value
      count++
    }
  }
}

export const spawnRandomCell = grid => {
  let count = 0
  while (count < 1) {
    const cell = new randomCell()

    if (!grid[cell.row][cell.column]) {
      grid[cell.row][cell.column] = cell.value
      count++
    }
  }
}


