function Gameboard() {
  const gameboard = [
    {
      player: 'You',
    },
    {
      player: 'Opponent',
    },
  ];

  const board = [];
  const row = 3;
  const col = 3;

  for (let x = 0; x < col; x++) {
    const rowCells = [];
    for (let y = 0; y < row; y++) {
      rowCells.push(`${x} ${y}`);
    }
    board.push(rowCells);
  }

  return {
    gameboard,
    board,
  }
}

const gameboard = Gameboard();
console.log(gameboard);