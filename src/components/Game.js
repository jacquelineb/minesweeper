import React, { useState, useEffect, useRef } from 'react';
import { DIFFICULTIES } from '../utils/constants';
import Tiles from './Tiles';
import Display from './Display';
import DifficultyMenu from './DifficultyMenu';
import useTilesReducer from '../hooks/useTilesReducer';
import explosion from '../assets/explosion.wav';
import style from '../styles/Game.module.scss';

import useGame from '../hooks/useGame';

const Game = () => {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);

  const { tiles, gameStatus, numMinesRemaining, handleNewGame, handleReveal, handleFlag } =
    useGame();

  const timerId = useRef();
  const timerIsActive = useRef(false);
  const [secondsLapsed, setSecondsLapsed] = useState(0);

  useEffect(() => {
    const { numRows, numCols, numMines } = difficulty;
    resetGame(numRows, numCols, numMines);
  }, [difficulty]);

  useEffect(() => {
    if (gameStatus) {
      stopTimer();
    }
  }, [gameStatus]);

  const resetGame = () => {
    handleNewGame(difficulty.numRows, difficulty.numCols, difficulty.numMines);
    stopTimer();
    setSecondsLapsed(0);
  };

  const startTimer = () => {
    timerId.current = setInterval(() => {
      setSecondsLapsed((prevState) => prevState + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerId.current);
    timerId.current = null;
    timerIsActive.current = false;
  };

  const handleClick = (row, col) => {
    if (!timerIsActive.current) {
      timerIsActive.current = true;
      startTimer();
    }
    handleReveal(row, col);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className={style.container} onContextMenu={(e) => e.preventDefault()}>
      <DifficultyMenu currDifficulty={difficulty} selectDifficulty={handleDifficultyChange} />

      <Display
        time={secondsLapsed}
        numMines={numMinesRemaining}
        status={gameStatus}
        onClick={resetGame}
      />

      <div className={`${style.tilesContainer} ${style[difficulty.level]}`}>
        <Tiles tiles={tiles} onClickTile={handleClick} onRightClickTile={handleFlag} />
      </div>
    </div>
  );
};

export default Game;
