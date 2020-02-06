import React, { useEffect, useCallback, useRef } from 'react';
import uuid from 'uuid';

import ModalLost from './ModalLost';
import Cell from './Cell';
import NewGameButton from './NewGameButton';
import UndoButton from './UndoButton';
import Score from './Score';

import { arrayClone, arraysEqual } from '../helpers/utility';
import { spawnTwoRandomCells, spawnRandomCell, emptyCell } from '../helpers/cell';
import { moveUp, moveDown, moveLeft, moveRight } from '../helpers/moves';
import { checkUp, checkDown, checkLeft, checkRight } from '../helpers/checks';
import { useLocalStorage } from '../helpers/useLocalStorage';

const Grid = () => {
  const inititalState = Array(4)
    .fill()
    .map(() => Array(4).fill(new emptyCell(0)));

  const gridRef = useRef();
  const [grid, setGrid] = useLocalStorage('grid', inititalState);
  const [score, setScore] = useLocalStorage('score', 0);
  const [bestScore, setBestScore] = useLocalStorage('bestScore', 0);
  const [isBestScoreInCurrentGame, setIsBestScoreInCurrentGame] = useLocalStorage('isBestScoreInCurrentGame', false);
  const [lastTurnGrid, setLastTurnGrid] = useLocalStorage('lastTurnGrid', inititalState);
  const [lastTurnScore, setLastTurnScore] = useLocalStorage('lastTurnScore', 0);
  const [modalIsOpen, setModalIsOpen] = useLocalStorage('modalIsOpen', false);

  // Key codes
  const UP = 38;
  const DOWN = 40;
  const LEFT = 37;
  const RIGHT = 39;

  const newGame = () => {
    // Reset
    setIsBestScoreInCurrentGame(false);
    setModalIsOpen(false);
    setLastTurnGrid(inititalState);
    setScore(0);

    // New grid with random two cells
    let gridClone = arrayClone(inititalState);
    spawnTwoRandomCells(gridClone);
    setGrid(gridClone);
  };

  const checkIsGridFull = grid => {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (!grid[row][column].value) return false;
        grid[row][column].className = '';
      }
    }
    return true;
  };

  const checkIsGameLost = useCallback(() => {
    const noMovesAvailable = checkUp(grid) && checkDown(grid) && checkLeft(grid) && checkRight(grid);
    noMovesAvailable && setModalIsOpen(true);
  }, [grid]);

  useEffect(() => {
    const checkIsGridEmpty = grid => {
      for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
          if (grid[row][column].value) return false;
        }
      }
      return true;
    };

    checkIsGridEmpty(grid) && newGame();
  }, [grid]);

  const updateBestScore = useCallback(
    score => {
      if (score <= bestScore) return;
      setBestScore(score);
      setIsBestScoreInCurrentGame(true);
    }, [bestScore]);

  useEffect(() => {
    if (checkIsGridFull(grid)) checkIsGameLost();
  }, [checkIsGameLost, grid, setModalIsOpen]);

  useEffect(() => {
    updateBestScore(score);

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

      const conditionForSpawnRandomCell =
        !arraysEqual(grid, gridClone) && !checkIsGridFull(gridClone);
      conditionForSpawnRandomCell && spawnRandomCell(gridClone);

      setLastTurnScore(score);
      setScore(score => score + roundScore);

      setLastTurnGrid(grid);
      setGrid(gridClone);
    };

    const handleKeyDown = e => {
      // disable scrolling on arrows
      if (e.keyCode === UP || e.keyCode === DOWN) e.preventDefault();

      const nonGameKey = e.keyCode !== UP && e.keyCode !== DOWN && e.keyCode !== LEFT && e.keyCode !== RIGHT;
      if (nonGameKey) return;

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

    if (score === bestScore && isBestScoreInCurrentGame) setBestScore(lastTurnScore);
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
          row.map((cell, column) => <Cell key={uuid()} cell={cell} row={index} column={column} />),
        )}
      </main>
      <ModalLost isOpen={modalIsOpen} newGame={newGame} />
    </section>
  );
};

export default Grid;
