import React from 'react';
import style from '../styles/Tile.module.scss';

const Tile = ({ revealTile, flagTile, tile }) => {
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
      classList.push(style['mines' + tile.value]);
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
      className={classList.join(' ')}
      onMouseUp={(e) => {
        if (e.button === 0) {
          // left click
          revealTile();
        }
      }}
      onMouseDown={(e) => {
        if (e.button === 2) {
          // right click
          flagTile();
        }
      }}
    ></div>
  );
};

export default Tile;
