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
    const isWinner = checkWinner();

    if (isWinner) {
      console.log(`Player ${getTurn()} Won the game!`);
      return;
    }

    setNextTurn();
  }

  const getTurn = () => turn;

  const setNextTurn = () => turn = (turn === 1) ? 2 : 1;

  const checkWinner = () => {
    let isWinner = false;
    const horizontal = horizontalCheck();
    const vertical = verticalCheck();
    const diagonal = diagonalCheck();

    console.log(horizontal, vertical, diagonal);
    
    if (horizontal === 3 || vertical === 3 || diagonal === 3) {
      isWinner = true;
    }

    return isWinner;
  }

  const horizontalCheck = () => {
    let mostConsecutive = 0;
    for (let x = 0; x < 3; x++) {
      let numberCount = 0;
      for (let y = 0; y < 3; y++) {
        if (gameboard.getMarker(x, y) === getTurn()) {
          numberCount++;
        }
      }
      mostConsecutive = Math.max(mostConsecutive, numberCount);
    }
    return mostConsecutive;
  }

  const verticalCheck = () => {
    let mostConsecutive = 0;
    for (let x = 0; x < 3; x++) {
      let numberCount = 0;
      for (let y = 0; y < 3; y++) {
        if (gameboard.getMarker(y, x) === getTurn()) {
          numberCount++;
        }
      }
      mostConsecutive = Math.max(mostConsecutive, numberCount);
    }
    return mostConsecutive;
  }

  const diagonalCheck = () => {
    if (gameboard.getMarker(0, 0) === getTurn() &&
      gameboard.getMarker(1, 1) === getTurn() &&
      gameboard.getMarker(2, 2) === getTurn() ||
      gameboard.getMarker(0, 2) === getTurn() &&
      gameboard.getMarker(1, 1) == getTurn() &&
      gameboard.getMarker(2, 0) == getTurn()) {
      return 3;
    }
    return 0;
  }

  return {
    getTurn,
    setNextTurn,
    gameboard,
    playRound,
  }
}

const game = GameController();
game.gameboard.printBoard();