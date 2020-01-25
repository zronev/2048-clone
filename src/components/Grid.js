import React, { useState, useEffect } from 'react'
import Cell from './Cell'
import NewGameButton from './NewGameButton'
import { arrayClone } from '../helpers/utility'
import { spawnTwoRandomCells, spawnRandomCell } from '../helpers/game'

const Grid = () => {
  const inititalState = Array(4)
    .fill()
    .map(() => Array(4).fill(0))
  const [grid, setGrid] = useState(inititalState)

  // Key codes
  const UP = 38
  const DOWN = 40
  const LEFT = 37
  const RIGHT = 39

  const newGame = () => {
    let gridClone = arrayClone(inititalState)
    spawnTwoRandomCells(gridClone)
    setGrid(gridClone)
  }

  const round = (direction, grid) => {
    let gridClone = arrayClone(grid)
    let hasMoveBeenMade = false

    switch (direction) {
      case UP:
        for (let row = 0; row < 4; row++) {
          for (let column = 0; column < 4; column++) {
            if (!gridClone[row][column]) continue
            let distance = 0
            let foundDistance = false

            while (!foundDistance) {
              let isOutBoundaries = row - (distance + 1) < 0
              let doesntColliding =
                !isOutBoundaries && !gridClone[row - (distance + 1)][column]

              if (!doesntColliding) foundDistance = true
              else distance++
            }

            if (distance) {
              let isOutBoundaries = row - (distance + 1) < 0
              let isEqual =
                !isOutBoundaries &&
                gridClone[row - (distance + 1)][column] === gridClone[row][column]

              if (isEqual)
                gridClone[row - (distance + 1)][column] = gridClone[row][column] ** 2
              else gridClone[row - distance][column] = gridClone[row][column]
              
              gridClone[row][column] = 0
              hasMoveBeenMade = true
            }
          }
        }
        break

      default:
        break
    }

    // hasMoveBeenMade && spawnRandomCell(gridClone)
    setGrid(gridClone)
  }

  useEffect(() => {
    const handleKeyDown = e => round(e.keyCode, grid)

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [grid])

  return (
    <section className="game">
      <NewGameButton newGame={newGame} />
      <main className="grid">
        {grid.map(row => row.map((cell, index) => <Cell key={index} value={cell} />))}
      </main>
    </section>
  )
}

export default Grid
