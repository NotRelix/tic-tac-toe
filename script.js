function Gameboard() {
  const board = [];
  const rowCount = 3;
  const colCount = 3;

  const gameboard = [
    {
      player: 'You',
    },
    {
      player: 'Opponent',
    },
  ];

  for (let x = 0; x < colCount; x++) {
    const rowCells = [];
    for (let y = 0; y < rowCount; y++) {
      rowCells.push(Cell());
    }
    board.push(rowCells);
  }

  const getBoard = () => board;

  return {
    gameboard,
    getBoard,
  }
}

function Cell() {
  let value = 0;   // 0: Empty, 1: You, 2: Opponent

  const getValue = () => value;
  const setValue = (playerCode) => {
    value = playerCode;
  }

  return {
    getValue,
    setValue,
  }
}

const gameboard = Gameboard();
gameboard.getBoard()[1][0].setValue(1);
console.log(gameboard.getBoard()[1][0].getValue());
console.log(gameboard.getBoard());