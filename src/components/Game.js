import React, { useState, useEffect } from 'react';
import Tiles from './Tiles';
import style from '../styles/Game.module.scss';
import useTilesReducer from '../hooks/useTilesReducer';

const DIFFICULTIES = [
  { level: 'beginner', numMines: 10, numRows: 9, numCols: 9 },
  { level: 'intermediate', numMines: 40, numRows: 16, numCols: 16 },
  { level: 'expert', numMines: 99, numRows: 16, numCols: 30 },
];

const DEFAULT_DIFFICULTY = DIFFICULTIES[0];

const Game = () => {
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [potentialNumMinesLeft, setPotentialNumMinesLeft] = useState(difficulty.numMines);
  const [gameStatus, setGameStatus] = useState(0); // win (1), lose (-1), or tbd (0)
  const [timer, setTimer] = useState(0);
  const [tiles, tilesDispatch] = useTilesReducer([]);

  console.log('rendering');
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    console.log('checking game status');
    if (tiles.length && gameStatus !== 'L') {
      if (checkGameIsWon()) {
        setGameStatus('W');
      }
    }
  }, [tiles, gameStatus]);

  const resetGame = () => {
    tilesDispatch({ type: 'INITIALIZE_TILES', payload: { ...difficulty } });
    setGameStatus(0);
    setPotentialNumMinesLeft(difficulty.numMines);
  };

  const checkGameIsWon = () => {
    for (const row of tiles) {
      for (const tile of row) {
        if (tile.isConcealed && tile.value !== 'M') {
          return false;
        }
      }
    }
    return true;
  };

  const handleClick = (row, col) => {
    if (tiles[row][col].isConcealed && !tiles[row][col].isFlagged) {
      if (tiles[row][col].value === 'M') {
        tilesDispatch({
          type: 'EXPLODE_MINE',
          payload: { tileCoord: { row, col } },
        });
        setGameStatus('L');
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

  return (
    <>
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
      <div>timer</div>
      <div>num mines left: {potentialNumMinesLeft}</div>
      <div>game status: {gameStatus}</div>
      <button
        onClick={() => {
          resetGame();
        }}
      >
        newgame
      </button>
    </>
  );
};

export default Game;
