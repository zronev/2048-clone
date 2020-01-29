import React, { useState, useEffect, useCallback, useRef } from 'react';

import ModalLost from './ModalLost';
import Cell from './Cell';
import NewGameButton from './NewGameButton';
import UndoButton from './UndoButton';
import Score from './Score';

import { arrayClone, arraysEqual } from '../helpers/utility';
import { spawnTwoRandomCells, spawnRandomCell, emptyCell } from '../helpers/cell';
import { moveUp, moveDown, moveLeft, moveRight } from '../helpers/moves';
import { checkUp, checkDown, checkLeft, checkRight } from '../helpers/checks';

const Grid = () => {
  const inititalState = Array(4)
    .fill()
    .map(() => Array(4).fill(new emptyCell(2)));

  // const inititalState = [
  //   [0, 16, 8, 0],
  //   [16, 8, 0, 8],
  //   [8, 0, 8, 16],
  //   [0, 8, 16, 0],
  // ]

  // const inititalState = [
  //   [0, 16, 8, 0],
  //   [0, 8, 0, 0],
  //   [8, 0, 8, 16],
  //   [0, 8, 16, 0],
  // ];

  // const inititalState = [
  //   [2, 8, 8, 4],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  // ]

  const gridRef = useRef();
  const [grid, setGrid] = useState(inititalState);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [lastTurnGrid, setLastTurnGrid] = useState(inititalState);
  const [lastTurnScore, setLastTurnScore] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Key codes
  const UP = 38;
  const DOWN = 40;
  const LEFT = 37;
  const RIGHT = 39;

  const newGame = useCallback(() => {
    // Reset
    setModalIsOpen(false);
    setLastTurnGrid(inititalState);
    setScore(0);

    // New grid with random two cells
    let gridClone = arrayClone(inititalState);
    spawnTwoRandomCells(gridClone);
    setGrid(gridClone);
  }, [inititalState]);

  useEffect(() => {
    newGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkIsGridFull = grid => {
      for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
          if (!grid[row][column].value) return false;
          grid[row][column].className = '';
        }
      }
      return true;
    };

    const checkIsGameLost = () => {
      const noMovesAvailable =
        !checkUp(grid) && !checkDown(grid) && !checkLeft(grid) && !checkRight(grid);

      noMovesAvailable && setModalIsOpen(true);
    };

    if (checkIsGridFull(grid)) checkIsGameLost();
  }, [grid]);

  useEffect(() => {
    score > bestScore && setBestScore(score);

    const gridNode = gridRef.current;
    let gridClone = arrayClone(grid);
    let roundScore = 0;

    let xDown = null;
    let yDown = null;

    const getTouches = e => e.touches;

    const handleTouchStart = e => {
      const firstTouch = getTouches(e)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    };

    const handleTouchMove = e => {
      e.preventDefault();
      if (!xDown || !yDown) return;

      let xUp = e.touches[0].clientX;
      let yUp = e.touches[0].clientY;

      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) [gridClone, roundScore] = moveLeft(gridClone, roundScore);
        else [gridClone, roundScore] = moveRight(gridClone, roundScore);
      } else {
        if (yDiff > 0) [gridClone, roundScore] = moveUp(gridClone, roundScore);
        else [gridClone, roundScore] = moveDown(gridClone, roundScore);
      }

      xDown = null;
      yDown = null;

      !arraysEqual(grid, gridClone) && spawnRandomCell(gridClone);
      setLastTurnGrid(grid);

      setGrid(gridClone);
    };

    const round = direction => {
      switch (direction) {
        case UP:
          [gridClone, roundScore] = moveUp(gridClone, roundScore);
          break;
        case DOWN:
          [gridClone, roundScore] = moveDown(gridClone, roundScore);
          break;
        case LEFT:
          [gridClone, roundScore] = moveLeft(gridClone, roundScore);
          break;
        case RIGHT:
          [gridClone, roundScore] = moveRight(gridClone, roundScore);
          break;
        default:
          break;
      }

      setLastTurnScore(score);
      setScore(score => score + roundScore);

      setLastTurnGrid(grid);
      !arraysEqual(grid, gridClone) && spawnRandomCell(gridClone);
      setGrid(gridClone);
    };

    const handleKeyDown = e => {
      // disable scrolling on arrows
      if (e.keyCode === UP || e.keyCode === DOWN) e.preventDefault();
      round(e.keyCode);
    };

    document.addEventListener('keydown', handleKeyDown);
    gridNode.addEventListener('touchstart', handleTouchStart);
    gridNode.addEventListener('touchmove', handleTouchMove);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      gridNode.removeEventListener('touchstart', handleTouchStart);
      gridNode.removeEventListener('touchmove', handleTouchMove);
    };
  }, [bestScore, grid, score]);

  const handleUndoClick = () => {
    if (arraysEqual(lastTurnGrid, inititalState)) return;
    setGrid(lastTurnGrid);
    setScore(lastTurnScore);
  };

  return (
    <section className="game">
      <header className="game-header">
        <div className="game-info">
          <h1 className="game-info__title">2048 Clone</h1>
          <Score score={score} bestScore={bestScore} />
        </div>
        <div className="buttons">
          <UndoButton handleUndoClick={handleUndoClick} />
          <NewGameButton newGame={newGame} parent="game-header" />
        </div>
      </header>
      <main ref={gridRef} className="grid">
        {grid.map((row, index) =>
          row.map((cell, column) => (
            <Cell key={column} cell={cell} row={row} column={column} />
          )),
        )}
      </main>
      <ModalLost isOpen={modalIsOpen} newGame={newGame} />
    </section>
  );
};

export default Grid;
