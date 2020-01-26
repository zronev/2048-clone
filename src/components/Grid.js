import React, { useState, useEffect, useCallback } from 'react'
import { arrayClone } from '../helpers/utility'
import { spawnTwoRandomCells, spawnRandomCell } from '../helpers/cell'
import Cell from './Cell'
import NewGameButton from './NewGameButton'
import { checkUp, checkDown, checkLeft, checkRight } from '../helpers/moves'
import ModalLost from './ModalLost'

const Grid = () => {
  const inititalState = Array(4)
    .fill()
    .map(() => Array(4).fill(0))
  const [grid, setGrid] = useState(inititalState)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  // Key codes
  const UP = 38
  const DOWN = 40
  const LEFT = 37
  const RIGHT = 39

  const newGame = useCallback(() => {
    setModalIsOpen(false)
    let gridClone = arrayClone(inititalState)
    spawnTwoRandomCells(gridClone)
    setGrid(gridClone)
  }, [inititalState])

  const round = (direction, grid) => {
    let gridClone = arrayClone(grid)
    let hasMoveBeenMade = false

    switch (direction) {
      case UP:
        for (let row = 0; row < 4; row++) {
          for (let column = 0; column < 4; column++) {
            const currentCell = gridClone[row][column]
            if (!currentCell) continue

            let isOutBoundaries = (distance, row) => row - (distance + 1) < 0

            let cellAbove = (row, column, distance) =>
              gridClone[row - (distance + 1)][column]

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

            if (distance || isEqual(row, column, distance)) {
              if (isEqual(row, column, distance))
                gridClone[row - (distance + 1)][column] = currentCell * 2
              else gridClone[row - distance][column] = currentCell

              gridClone[row][column] = 0
              hasMoveBeenMade = true
              if (isEqual(row, column, distance)) row = 0
            }
          }
        }
        break

      case DOWN:
        for (let row = 3; row > -1; row--) {
          for (let column = 0; column < 4; column++) {
            const currentCell = gridClone[row][column]
            if (!currentCell) continue

            let isOutBoundaries = (row, distance) => row + (distance + 1) > 3

            let cellBelow = (row, column, distance) =>
              gridClone[row + (distance + 1)][column]

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

            if (distance || isEqual(row, column, distance)) {
              if (isEqual(row, column, distance))
                gridClone[row + (distance + 1)][column] = gridClone[row][column] * 2
              else gridClone[row + distance][column] = gridClone[row][column]

              gridClone[row][column] = 0
              hasMoveBeenMade = true
              if (isEqual(row, column, distance)) row = 3
            }
          }
        }
        break

      case LEFT:
        for (let column = 0; column < 4; column++) {
          for (let row = 0; row < 4; row++) {
            const currentCell = gridClone[row][column]
            if (!currentCell) continue

            let isOutBoundaries = (column, distance) => column - (distance + 1) < 0

            let cellOnLeft = (row, column, distance) =>
              gridClone[row][column - (distance + 1)]

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

            if (distance || isEqual(row, column, distance)) {
              if (isEqual(row, column, distance))
                gridClone[row][column - (distance + 1)] = gridClone[row][column] * 2
              else gridClone[row][column - distance] = gridClone[row][column]

              gridClone[row][column] = 0
              hasMoveBeenMade = true
              if (isEqual(row, column, distance)) column = 0
            }
          }
        }
        break

      case RIGHT:
        for (let column = 3; column > -1; column--) {
          for (let row = 0; row < 4; row++) {
            const currentCell = gridClone[row][column]
            if (!currentCell) continue

            let isOutBoundaries = (column, distance) => column + (distance + 1) > 3

            let cellOnLeft = (row, column, distance) =>
              gridClone[row][column + (distance + 1)]

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

            if (distance || isEqual(row, column, distance)) {
              if (isEqual(row, column, distance))
                gridClone[row][column + (distance + 1)] = gridClone[row][column] * 2
              else gridClone[row][column + distance] = gridClone[row][column]

              gridClone[row][column] = 0
              hasMoveBeenMade = true
              if (isEqual) column = 3
            }
          }
        }
        break

      default:
        break
    }

    hasMoveBeenMade && spawnRandomCell(gridClone)
    setGrid(gridClone)
  }

  useEffect(() => {
    newGame()
  }, [])

  useEffect(() => {
    const checkIsGridFull = grid => {
      for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
          if (!grid[row][column]) return false
        }
      }
      return true
    }

    const checkIsGameLost = () => {
      console.log('checkUp: ', checkUp(grid))
      console.log('checkDown: ', checkDown(grid))
      console.log('checkLeft: ', checkLeft(grid))
      console.log('checkRight: ', checkRight(grid))
      if (!checkUp(grid) && !checkDown(grid) && !checkLeft(grid) && !checkRight(grid)) {
        setModalIsOpen(true)
        console.log('YOU LOST')
      }
    }

    if (checkIsGridFull(grid)) checkIsGameLost()
  }, [grid])

  useEffect(() => {
    const handleKeyDown = e => {
      // disable scrolling on arrows
      if (e.keyCode === UP || e.keyCode === DOWN) e.preventDefault()
      round(e.keyCode, grid)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [grid])

  return (
    <section className="game">
      <NewGameButton newGame={newGame} parent="game" />
      <main className="grid">
        {grid.map(row => row.map((cell, index) => <Cell key={index} value={cell} />))}
      </main>
      <ModalLost isOpen={modalIsOpen} newGame={newGame} />
    </section>
  )
}

export default Grid
