function Gameboard() {
  const board = [];
  const rowCount = 3;
  const colCount = 3;

  for (let x = 0; x < rowCount; x++) {
    const rowCells = [];
    for (let y = 0; y < rowCount; y++) {
      rowCells.push(Cell());
    }
    board.push(rowCells);
  }

  const getBoard = () => board;

  const setMarker = (x, y, playerCode) => {
    getBoard()[x][y].setValue(playerCode);
  }

  const printBoard = () => {
    for (let x = 0; x < rowCount; x++) {
      const rowCells = [];
      for (let y = 0; y < colCount; y++) {
        rowCells.push(board[x][y].getValue());
      }
      console.log(rowCells);
    }
  }

  return {
    getBoard,
    setMarker,
    printBoard,
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

function GameController() {
  const playerOne = 'You';
  const playerTwo = 'Opponent';
  let turn = 1;   // 1: Player One, 2: Player Two

  const getTurn = () => turn;

  const setNextTurn = () => turn = (turn === 1) ? 2 : 1;

  return {
    getTurn,
    setNextTurn,
  }
}

const gameController = GameController();
const gameboard = Gameboard();
gameboard.setMarker(0, 0, gameController.getTurn());
gameController.setNextTurn();
gameboard.setMarker(1, 1, gameController.getTurn());
gameController.setNextTurn();
gameboard.setMarker(2, 0, gameController.getTurn());

gameboard.printBoard();