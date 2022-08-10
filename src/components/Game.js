import React, { useState, useEffect, useRef } from 'react';
import Tiles from './Tiles';
import Display from './Display';
import DifficultyMenu from './DifficultyMenu';
import style from '../styles/Game.module.scss';
import useTilesReducer from '../hooks/useTilesReducer';
import { DIFFICULTIES } from '../utils/constants';

const Game = () => {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [potentialNumMinesLeft, setPotentialNumMinesLeft] = useState(difficulty.numMines);
  const [gameStatus, setGameStatus] = useState(0); // win (1), lose (-1), or tbd (0)
  const [tiles, tilesDispatch] = useTilesReducer([]);

  const timerId = useRef();
  const timerIsActive = useRef(false);
  const [secondsLapsed, setSecondsLapsed] = useState(0);

  console.log('rendering');
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    if (tiles.length && gameStatus !== 'L') {
      const gameIsWon = (() => {
        for (const row of tiles) {
          for (const tile of row) {
            if (tile.isConcealed && tile.value !== 'M') {
              return false;
            }
          }
        }
        return true;
      })();

      if (gameIsWon) {
        setGameStatus('W');
        stopTimer();
      }
    }
  }, [tiles, gameStatus]);

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

  const resetGame = () => {
    tilesDispatch({ type: 'INITIALIZE_TILES', payload: { ...difficulty } });
    setGameStatus(0);
    setPotentialNumMinesLeft(difficulty.numMines);
    stopTimer();
    setSecondsLapsed(0);
  };

  const handleClick = (row, col) => {
    if (!timerIsActive.current) {
      timerIsActive.current = true;
      startTimer();
    }

    if (tiles[row][col].isConcealed && !tiles[row][col].isFlagged) {
      if (tiles[row][col].value === 'M') {
        setGameStatus('L');
        stopTimer();
        tilesDispatch({
          type: 'EXPLODE_MINE',
          payload: { tileCoord: { row, col } },
        });
        tilesDispatch({ type: 'REVEAL_MINES_AND_FLAGS' });
      } else {
        tilesDispatch({
          type: 'REVEAL_SAFE_TILES',
          payload: { tileCoord: { row, col } },
        });
      }
    }
  };

  const handleRightClick = (row, col) => {
    if (tiles[row][col].isConcealed) {
      if (!tiles[row][col].isFlagged) {
        tilesDispatch({
          type: 'FLAG_TILE',
          payload: { tileCoord: { row, col } },
        });
        setPotentialNumMinesLeft(potentialNumMinesLeft - 1);
      } else {
        tilesDispatch({ type: 'UNFLAG_TILE', payload: { tileCoord: { row, col } } });
        setPotentialNumMinesLeft(potentialNumMinesLeft + 1);
      }
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className={style.container}>
      <DifficultyMenu currDifficulty={difficulty} selectDifficulty={handleDifficultyChange} />
      <Display time={secondsLapsed} numMines={potentialNumMinesLeft} status={gameStatus} />
      <div className={`${style.tilesContainer} ${style[difficulty.level]}`}>
        <Tiles
          tiles={tiles}
          onClick={(row, col) => {
            if (!gameStatus) {
              handleClick(row, col);
            }
          }}
          onRightClick={(row, col) => {
            if (!gameStatus) {
              handleRightClick(row, col);
            }
          }}
        />
      </div>

      <button
        onClick={() => {
          resetGame();
        }}
      >
        newgame
      </button>
    </div>
  );
};

export default Game;
