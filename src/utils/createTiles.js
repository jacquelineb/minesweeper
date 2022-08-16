const createTiles = (numRows, numCols, numMines) => {
  let tiles = [];

  // initialize board
  for (let i = 0; i < numRows; i++) {
    const rowOfTiles = [];
    for (let j = 0; j < numCols; j++) {
      rowOfTiles.push({ isConcealed: true, isFlagged: false, value: 0 });
    }
    tiles.push(rowOfTiles);
  }

  // place mines
  let numMinesPlaced = 0;
  while (numMinesPlaced < numMines) {
    const row = Math.floor(Math.random() * numRows);
    const col = Math.floor(Math.random() * numCols);
    if (tiles[row][col].value !== 'M') {
      tiles[row][col].value = 'M';
      numMinesPlaced++;
    }
  }

  // Update the value of all other non-mine tiles. The value will represent the number of mines surrounding the tile
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (tiles[i][j].value !== 'M') {
        tiles[i][j].value = countAdjacentMines(i, j);
      }
    }
  }

  function countAdjacentMines(row, col) {
    let numAdjacentMines = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          !(i === row && j === col) &&
          i >= 0 &&
          i < numRows &&
          j >= 0 &&
          j < numCols &&
          tiles[i][j].value === 'M'
        ) {
          numAdjacentMines++;
        }
      }
    }
    return numAdjacentMines;
  }

  return tiles;
};

export default createTiles;
