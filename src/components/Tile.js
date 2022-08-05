import React from 'react';
import style from '../styles/Tile.module.scss';

const Tile = ({ row, col, revealTile, flagTile, tile }) => {
  let tileView;
  if (tile.isFlagged) {
    tileView = 'F';
  } else if (!tile.isConcealed) {
    tileView = tile.numSurroundingMines;
  } else {
    if (tile.isMine) {
      tileView = '.';
    }
  }

  return (
    <div
      className={`${style.tile} ${
        tile.isConcealed ? style.concealed : `${style['mines' + tile.numSurroundingMines]}`
      }`}
      data-row={row}
      data-col={col}
      onClick={revealTile}
      onContextMenu={(e) => {
        e.preventDefault();
        console.log('flagging tile');
        console.log(+e.target.dataset.row, +e.target.dataset.col);
        flagTile();
      }}
    >
      {tileView}
    </div>
  );
};

export default Tile;
