import { useEffect, useState } from 'react';
import createTiles from '../utils/createTiles';
import explosionSound from '../assets/explosion.wav';
import flagSound from '../assets/flag.wav';
import unflagSound from '../assets/unflag.wav';
import victorySound from '../assets/victory.wav';

const useGame = () => {
  const [tiles, setTiles] = useState();
  const [gameStatus, setGameStatus] = useState(0);
  const [numMinesRemaining, setNumMinesRemaining] = useState();

  // Check if game is won or is still going
  useEffect(() => {
    if (tiles && gameStatus !== 'L') {
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
        const audio = new Audio(victorySound);
        audio.play();
        setGameStatus('W');
        setNumMinesRemaining(0);
      }
    }
  }, [tiles]);

  useEffect(() => {
    // When game is won, flag all the mines if not already flagged
    if (gameStatus === 'W') {
      setTiles((prevTiles) => {
        return prevTiles.map((rowOfTiles) => {
          return rowOfTiles.map((tile) => {
            if (tile.value === 'M' && !tile.isFlagged) {
              return { ...tile, isFlagged: true };
            }
            return tile;
          });
        });
      });
    }
  }, [gameStatus]);

  const handleNewGame = (numRows, numCols, numMines) => {
    const newTiles = createTiles(numRows, numCols, numMines);
    setTiles(newTiles);
    setNumMinesRemaining(numMines);
    setGameStatus(0);
  };

  const handleReveal = (row, col) => {
    if (!gameStatus && tiles[row][col].isConcealed && !tiles[row][col].isFlagged) {
      const updatedTiles = tiles.map((rowOfTiles) => rowOfTiles.map((tile) => tile));

      // Clicking on a mine. Mine explodes (set its value to 'X') and reveal all mines and flagged tiles)
      if (tiles[row][col].value === 'M') {
        setGameStatus('L');
        updatedTiles.forEach((rowOfTiles, i) => {
          rowOfTiles.forEach((tile, j) => {
            if (tile.value === 'M' || tile.isFlagged) {
              const updatedTile = { ...tile, isConcealed: false };
              if (i === row && j === col) {
                updatedTile.value = 'X';
                const audio = new Audio(explosionSound);
                audio.play();
              }
              updatedTiles[i][j] = updatedTile;
            }
          });
        });
      }
      // Clicking on non-mine tile. If the tile has 0 mines around it, recursively repeat the process to reveal non-mine tiles around it.
      else {
        (function revealSafeArea(row, col) {
          updatedTiles[row][col] = { ...tiles[row][col], isConcealed: false };
          if (updatedTiles[row][col].value === 0) {
            for (let i = row - 1; i <= row + 1; i++) {
              for (let j = col - 1; j <= col + 1; j++) {
                if (
                  !(i === row && j === col) &&
                  updatedTiles[i] &&
                  updatedTiles[i][j] &&
                  updatedTiles[i][j].isConcealed &&
                  !updatedTiles[i][j].isFlagged &&
                  updatedTiles[i][j].value !== 'M'
                ) {
                  revealSafeArea(i, j);
                }
              }
            }
          }
        })(row, col);
      }
      setTiles(updatedTiles);
    }
  }; // handleReveal

  const handleFlag = (row, col) => {
    if (!gameStatus && tiles[row][col].isConcealed) {
      const updatedTiles = tiles.map((rowOfTiles) => rowOfTiles.map((tile) => tile));
      if (!tiles[row][col].isFlagged) {
        setNumMinesRemaining((prevState) => prevState - 1);
        updatedTiles[row][col] = { ...tiles[row][col], isFlagged: true };
        const audio = new Audio(flagSound);
        audio.play();
      } else {
        setNumMinesRemaining((prevState) => prevState + 1);
        updatedTiles[row][col] = { ...tiles[row][col], isFlagged: false };
        const audio = new Audio(unflagSound);
        audio.play();
      }
      setTiles(updatedTiles);
    }
  }; // handleFlag

  return {
    tiles,
    gameStatus,
    numMinesRemaining,
    handleNewGame,
    handleReveal,
    handleFlag,
  };
};

export default useGame;
