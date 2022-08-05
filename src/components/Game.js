import React from 'react';
import Gameboard from './Gameboard';

const Game = () => {
  return (
    <div>
      <Gameboard numRows={8} numCols={8} numMines={10} />
    </div>
  );
};

export default Game;
