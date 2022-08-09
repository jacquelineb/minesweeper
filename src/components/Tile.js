import React from 'react';
import style from '../styles/Tile.module.scss';

const Tile = ({ revealTile, flagTile, tile }) => {
  // just so i can see which tiles are mines
  let tileView;
  if (tile.value === 'M') {
    tileView = '.';
  }

  let classList = [style.tile];
  if (!tile.isConcealed && !tile.isFlagged) {
    if (tile.value === 'M') {
      // plain mine
      classList.push(style.mine);
    } else if (tile.value === 'X') {
      // exploded mine
      classList.push(style.mineExplode);
    } else {
      // numbered tile
      classList.push(style['mines' + tile.numSurroundingMines]);
    }
  } else if (
    (tile.isConcealed && tile.isFlagged) ||
    (!tile.isConcealed && tile.isFlagged && tile.value === 'M')
  ) {
    // plain flag
    classList.push(style.flagged);
  } else if (!tile.isConcealed && tile.isFlagged && tile.value !== 'M') {
    // bad flag
    classList.push(style.flaggedIncorrect);
  } else {
    // concealed tile
    classList.push(style.concealed);
  }

  return (
    <div
      className={style.tileContainer}
      onClick={revealTile}
      onContextMenu={(e) => {
        e.preventDefault();
        flagTile();
      }}
    >
      <div className={classList.join(' ')}>{tileView}</div>
    </div>
  );
};

export default Tile;
