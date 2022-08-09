import { useReducer } from 'react';

const useTilesReducer = (initialTiles) => {
  const [state, dispatch] = useReducer(reducer, initialTiles);

  function reducer(tiles, action) {
    const updatedTiles = tiles.map((row) => {
      return row.map((tile) => ({ ...tile }));
    });

    const revealSafeArea = (row, col) => {
      updatedTiles[row][col].isConcealed = false;
      updatedTiles[row][col].numSurroundingMines = countSurroundingMines(row, col);
      if (updatedTiles[row][col].numSurroundingMines === 0) {
        for (let i = row - 1; i <= row + 1; i++) {
          for (let j = col - 1; j <= col + 1; j++) {
            if (
              !(i === row && j === col) &&
              updatedTiles[i] &&
              updatedTiles[i][j] &&
              updatedTiles[i][j].isConcealed &&
              !updatedTiles[i][j].isFLagged &&
              updatedTiles[i][j].value !== 'M'
            ) {
              //updatedTiles[i][j].isConcealed = false;
              revealSafeArea(i, j);
            }
          }
        }
      }
    };

    const countSurroundingMines = (row, col) => {
      let numSurroundingMines = 0;
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (
            !(i === row && j === col) &&
            tiles[i] &&
            tiles[i][j] &&
            tiles[i][j].value === 'M'
          ) {
            numSurroundingMines++;
          }
        }
      }
      return numSurroundingMines;
    };

    switch (action.type) {
      case 'REVEAL_SAFE_TILES': {
        const { row, col } = action.payload.tileCoord;
        revealSafeArea(row, col);
        return updatedTiles;
      }

      case 'FLAG_TILE': {
        const { row, col } = action.payload.tileCoord;
        updatedTiles[row][col].isFlagged = true;
        return updatedTiles;
      }

      case 'UNFLAG_TILE': {
        const { row, col } = action.payload.tileCoord;
        updatedTiles[row][col].isFlagged = false;
        return updatedTiles;
      }

      case 'EXPLODE_MINE': {
        const { row, col } = action.payload.tileCoord;
        updatedTiles[row][col].value = 'X';
        updatedTiles[row][col].isConcealed = false;
        return updatedTiles;
      }

      case 'REVEAL_MINES_AND_FLAGS': {
        updatedTiles.forEach((row) => {
          row.forEach((tile) => {
            if (tile.value === 'M' || tile.isFlagged) {
              tile.isConcealed = false;
            }
          });
        });
        return updatedTiles;
      }

      case 'INITIALIZE_TILES': {
        const board = [];
        for (let i = 0; i < action.payload.numRows; i++) {
          const boardRow = [];
          for (let j = 0; j < action.payload.numCols; j++) {
            const tile = {
              isFlagged: false,
              isConcealed: true,
              value: null,
            };
            boardRow.push(tile);
          }
          board.push(boardRow);
        }

        let numMinesPlaced = 0;
        while (numMinesPlaced < action.payload.numMines) {
          const row = Math.floor(Math.random() * action.payload.numRows);
          const col = Math.floor(Math.random() * action.payload.numCols);
          if (board[row][col].value !== 'M') {
            board[row][col].value = 'M';
            numMinesPlaced++;
          }
        }
        return board;
      }
      default:
        return tiles;
    }
  } // reducer

  return [state, dispatch];
};

export default useTilesReducer;
