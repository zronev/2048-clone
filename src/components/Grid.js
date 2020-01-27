import React, { useState, useEffect, useCallback } from 'react'

import ModalLost from './ModalLost'
import Cell from './Cell'
import NewGameButton from './NewGameButton'

import { arrayClone, arraysEqual } from '../helpers/utility'
import { spawnTwoRandomCells, spawnRandomCell } from '../helpers/cell'
import { moveUp, moveDown, moveLeft, moveRight } from '../helpers/moves'
import { checkUp, checkDown, checkLeft, checkRight } from '../helpers/checks'

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
      const noMovesAvailable =
        !checkUp(grid) && !checkDown(grid) && !checkLeft(grid) && !checkRight(grid)

      noMovesAvailable && setModalIsOpen(true)
    }

    if (checkIsGridFull(grid)) checkIsGameLost()
  }, [grid])

  useEffect(() => {
    const round = (direction, grid) => {
      let gridClone = arrayClone(grid)

      switch (direction) {
        case UP:
          moveUp(gridClone)
          break
        case DOWN:
          moveDown(gridClone)
          break
        case LEFT:
          moveLeft(gridClone)
          break
        case RIGHT:
          moveRight(gridClone)
          break
        default:
          break
      }

      !arraysEqual(grid, gridClone) && spawnRandomCell(gridClone)
      setGrid(gridClone)
    }

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
        {grid.map((row, index) =>
          row.map((cell, column) => (
            <Cell key={column} value={cell} row={index} column={column} />
          )),
        )}
      </main>
      <ModalLost isOpen={modalIsOpen} newGame={newGame} />
    </section>
  )
}

export default Grid
