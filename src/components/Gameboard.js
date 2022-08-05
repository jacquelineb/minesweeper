import React from 'react';
import { useState, useEffect } from 'react';
import Tile from './Tile';
import style from '../styles/Gameboard.module.scss';

const Gameboard = ({ numRows, numCols, numMines }) => {
  const [gameboard, setGameboard] = useState(() => {
    const board = [];
    for (let i = 0; i < numRows; i++) {
      const boardRow = [];
      for (let j = 0; j < numCols; j++) {
        const tile = {
          isMine: false,
          isFlagged: false,
          isConcealed: true,
        };
        console.log(tile);
        boardRow.push(tile);
      }
      board.push(boardRow);
    }

    let numMinesPlaced = 0;
    while (numMinesPlaced < numMines) {
      const row = Math.floor(Math.random() * numRows);
      const col = Math.floor(Math.random() * numCols);
      if (!board[row][col].isMine) {
        console.log(`placing mine ${numMinesPlaced + 1} at ${row} ${col}`);
        board[row][col].isMine = true;
        numMinesPlaced++;
      }
    }
    return board;
  });

  const countSurroundingMines = (row, col) => {
    console.log(`counting surrounding mines for tile ${row} ${col}`);
    let numSurroundingMines = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i === row && j === col) continue;
        if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
          console.log(`checking tile ${i} ${j}`);
          if (gameboard[i][j].isMine) {
            numSurroundingMines++;
          }
        }
      }
    }

    return numSurroundingMines;
  };

  const revealTile = (row, col) => {
    const tile = gameboard[row][col];
    if (tile.isConcealed && !tile.isFlagged) {
      if (tile.isMine) {
        // game over. lose
        console.log('loser');
      } else {
        console.log('counting mines');
        const updatedBoard = [...gameboard];
        updatedBoard[row][col].isConcealed = false;
        updatedBoard[row][col].numSurroundingMines = countSurroundingMines(row, col);
        setGameboard(updatedBoard);

        if (updatedBoard[row][col].numSurroundingMines === 0) {
          for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
              if (i === row && j === col) continue;
              if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
                revealTile(i, j);
              }
            }
          }
        }
      }
    }
  };

  const flagTile = (row, col) => {
    console.log(`flagging tile ${row} ${col}`);
    if (gameboard[row][col].isConcealed) {
      const updatedBoard = [...gameboard];
      updatedBoard[row][col].isFlagged = !updatedBoard[row][col].isFlagged;
      setGameboard(updatedBoard);
    }
  };

  return (
    <div className={style.gridContainer}>
      {gameboard.map((row, rowIndex) => {
        return row.map((tile, colIndex) => {
          return (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              revealTile={() => revealTile(rowIndex, colIndex)}
              flagTile={() => flagTile(rowIndex, colIndex)}
              tile={tile}
            />
          );
        });
      })}
    </div>
  );
};

export default Gameboard;
