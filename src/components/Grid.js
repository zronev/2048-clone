import React, { useState, useEffect, useCallback, useRef } from 'react'

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
  const gridRef = useRef()

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
    const gridNode = gridRef.current
    let gridClone = arrayClone(grid)

    let xDown = null
    let yDown = null

    const getTouches = e => e.touches

    const handleTouchStart = e => {
      const firstTouch = getTouches(e)[0]
      xDown = firstTouch.clientX
      yDown = firstTouch.clientY
    }

    const handleTouchMove = e => {
      e.preventDefault()
      if (!xDown || !yDown) return

      let xUp = e.touches[0].clientX
      let yUp = e.touches[0].clientY

      let xDiff = xDown - xUp
      let yDiff = yDown - yUp

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) moveLeft(gridClone)
        else moveRight(gridClone)
      } else {
        if (yDiff > 0) moveUp(gridClone)
        else moveDown(gridClone)
      }

      xDown = null
      yDown = null

      !arraysEqual(grid, gridClone) && spawnRandomCell(gridClone)
      setGrid(gridClone)
    }

    const round = direction => {
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
      round(e.keyCode)
    }

    document.addEventListener('keydown', handleKeyDown)
    gridNode.addEventListener('touchstart', handleTouchStart)
    gridNode.addEventListener('touchmove', handleTouchMove)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      gridNode.removeEventListener('touchstart', handleTouchStart)
      gridNode.removeEventListener('touchmove', handleTouchMove)
    }
  }, [grid])

  return (
    <section className="game">
      <NewGameButton newGame={newGame} parent="game" />
      <main ref={gridRef} className="grid">
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
