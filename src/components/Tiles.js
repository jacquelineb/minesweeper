import React from 'react';
import Tile from './Tile';

const Tiles = ({ tiles, onClickTile, onRightClickTile }) => {
  return (
    <>
      {tiles.map((row, rowIndex) => {
        return row.map((tile, colIndex) => {
          return (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              revealTile={() => onClickTile(rowIndex, colIndex)}
              flagTile={() => {
                onRightClickTile(rowIndex, colIndex);
              }}
              tile={tile}
            />
          );
        });
      })}
    </>
  );
};

export default Tiles;
