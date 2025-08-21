import React, { useEffect, useState } from 'react';
import useLongTouch from '../hooks/useLongTouch';
import style from '../styles/Tile.module.scss';

const Tile = ({ revealTile, flagTile, tile }) => {
  const [tileStyle, setTileStyle] = useState('');
  const longTouchEvent = useLongTouch(flagTile, 400);

  useEffect(() => {
    if (!tile.isConcealed && !tile.isFlagged) {
      if (tile.value === 'M') {
        // plain mine
        setTileStyle(style.mine);
      } else if (tile.value === 'X') {
        // exploded mine
        setTileStyle(style.mineExplode);
      } else {
        // numbered tile
        setTileStyle(style['mines' + tile.value]);
      }
    } else if (
      (tile.isConcealed && tile.isFlagged) ||
      (!tile.isConcealed && tile.isFlagged && tile.value === 'M')
    ) {
      // plain flag
      setTileStyle(style.flagged);
    } else if (!tile.isConcealed && tile.isFlagged && tile.value !== 'M') {
      // bad flag
      setTileStyle(style.flaggedIncorrect);
    } else {
      // concealed tile
      setTileStyle(style.concealed);
    }
  }, [tile]);

  return (
    <div
      className={`${style.tile} ${tileStyle}`}
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
      {...longTouchEvent}
    ></div>
  );
};

export default Tile;
