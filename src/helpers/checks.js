export const checkUp = grid => {
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      const currentCell = grid[row][column]

      let isOutBoundaries = (distance, row) => row - (distance + 1) < 0

      let cellAbove = (row, column, distance) => grid[row - (distance + 1)][column]

      let isEqual = (row, column, distance) =>
        !isOutBoundaries(distance, row) &&
        cellAbove(row, column, distance) === currentCell

      let doesntColliding = (row, column, distance) =>
        !isOutBoundaries(distance, row) && !cellAbove(row, column, distance)

      let distance = 0
      let foundDistance = false

      while (!foundDistance) {
        if (!doesntColliding(row, column, distance)) foundDistance = true
        else distance++
      }

      if (distance || isEqual(row, column, distance)) return true
    }
  }
  return false
}

export const checkDown = grid => {
  for (let row = 3; row > -1; row--) {
    for (let column = 0; column < 4; column++) {
      const currentCell = grid[row][column]
      if (!currentCell) continue

      let isOutBoundaries = (row, distance) => row + (distance + 1) > 3

      let cellBelow = (row, column, distance) => grid[row + (distance + 1)][column]

      let isEqual = (row, column, distance) =>
        !isOutBoundaries(row, distance) &&
        cellBelow(row, column, distance) === currentCell

      let doesntColliding = (row, column, distance) =>
        !isOutBoundaries(row, distance) && !cellBelow(row, column, distance)

      let distance = 0
      let foundDistance = false

      while (!foundDistance) {
        if (!doesntColliding(row, column, distance)) foundDistance = true
        else distance++
      }

      if (distance || isEqual(row, column, distance)) return true
    }
  }
  return false
}

export const checkLeft = grid => {
  for (let column = 0; column < 4; column++) {
    for (let row = 0; row < 4; row++) {
      const currentCell = grid[row][column]
      if (!currentCell) continue

      let isOutBoundaries = (column, distance) => column - (distance + 1) < 0

      let cellOnLeft = (row, column, distance) => grid[row][column - (distance + 1)]

      let isEqual = (row, column, distance) =>
        !isOutBoundaries(column, distance) &&
        cellOnLeft(row, column, distance) === currentCell

      let doesntColliding = (row, column, distance) =>
        !isOutBoundaries(column, distance) && !cellOnLeft(row, column, distance)

      let distance = 0
      let foundDistance = false

      while (!foundDistance) {
        if (!doesntColliding(row, column, distance)) foundDistance = true
        else distance++
      }

      if (distance || isEqual(row, column, distance)) return true
    }
  }
  return false
}

export const checkRight = grid => {
  for (let column = 3; column > -1; column--) {
    for (let row = 0; row < 4; row++) {
      const currentCell = grid[row][column]
      if (!currentCell) continue

      let isOutBoundaries = (column, distance) => column + (distance + 1) > 3

      let cellOnLeft = (row, column, distance) => grid[row][column + (distance + 1)]

      let isEqual = (row, column, distance) =>
        !isOutBoundaries(column, distance) &&
        cellOnLeft(row, column, distance) === currentCell

      let doesntColliding = (row, column, distance) =>
        !isOutBoundaries(column, distance) && !cellOnLeft(row, column, distance)

      let distance = 0
      let foundDistance = false

      while (!foundDistance) {
        if (!doesntColliding(row, column, distance)) foundDistance = true
        else distance++
      }

      if (distance || isEqual(row, column, distance)) return true
    }
  }
  return false
}
