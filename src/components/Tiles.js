import React from 'react';
import Tile from './Tile';

const Tiles = ({ tiles, onClick, onRightClick }) => {
  return (
    <>
      {tiles.map((row, rowIndex) => {
        return row.map((tile, colIndex) => {
          return (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              revealTile={() => onClick(rowIndex, colIndex)}
              flagTile={() => {
                onRightClick(rowIndex, colIndex);
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
