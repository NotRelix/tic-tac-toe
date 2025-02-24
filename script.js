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

  const getMarker = (x, y) => getBoard()[x][y].getValue()

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
    getMarker,
    setMarker,
    printBoard,
  }
}

function Cell() {
  let value = 0;    // 0: Empty, 1: You, 2: Opponent

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
  const gameboard = Gameboard();
  const playerOne = 'You';
  const playerTwo = 'Opponent';
  
  let turn = 1;     // 1: Player One, 2: Player Two

  const playRound = (x, y) => {
    if (gameboard.getMarker(x, y) > 0) {
      console.log("Choose another one")
      return;
    }
    gameboard.setMarker(x, y, getTurn());
    setNextTurn();
  }

  const getTurn = () => turn;

  const setNextTurn = () => turn = (turn === 1) ? 2 : 1;

  // TODO: Add winner function
  const checkWinner = () => {

  }

  return {
    getTurn,
    setNextTurn,
    gameboard,
    playRound,
  }
}

const game = GameController();
game.playRound(0, 0);
game.playRound(1, 1);
game.playRound(2, 0);
game.playRound(2, 0);

game.gameboard.printBoard();