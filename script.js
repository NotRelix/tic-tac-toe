function Gameboard() {
  let board = [];
  const rowCount = 3;
  const colCount = 3;

  const generateBoard = () => {
    for (let x = 0; x < rowCount; x++) {
      const rowCells = [];
      for (let y = 0; y < rowCount; y++) {
        rowCells.push(Cell());
      }
      board[x] = rowCells;
    }
  }

  const getBoard = () => board;

  const getMarker = (x, y) => getBoard()[x][y].getValue()

  const setMarker = (x, y, playerCode) => {
    getBoard()[x][y].setValue(playerCode);
  }

  const resetBoard = () => {
    for (let x = 0; x < rowCount; x++) {
      for (let y = 0; y < colCount; y++) {
        getBoard()[x][y].setValue(0);
      }
    }
    generateBoard();
  }

  return {
    generateBoard,
    getBoard,
    getMarker,
    setMarker,
    resetBoard,
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
  
  gameboard.generateBoard();
  
  let turn = 1;     // 1: Player One, 2: Player Two
  let isGameFinished = 0;
  
  const getTurn = () => turn;
  
  const setNextTurn = () => turn = (turn === 1) ? 2 : 1;
  
  const rules = GameRules(gameboard, getTurn);
  
  const playRound = (x, y, e) => {

    if (isGameFinished) {
      console.log(`Please start a new game`);
      return;
    }

    if (gameboard.getMarker(x, y) > 0) {
      console.log("Choose another one")
      return;
    }

    gameboard.setMarker(x, y, getTurn());
    e.target.textContent = (turn === 1) ? 'O' : 'X';

    const hasWinner = rules.checkWinner();
    if (hasWinner) {
      console.log(`Player ${getTurn()} Won the game!`);
      finishGame();
      return;
    }

    const isDraw = rules.checkDraw();
    if (isDraw) {
      console.log(`Tie! It's a Draw!`);
      finishGame();
      return;
    }

    setNextTurn();
  }

  const finishGame = () => isGameFinished = 1;

  const resetGame = () => {
    turn = 1;
    isGameFinished = 0;
    gameboard.resetBoard();
  }

  return {
    gameboard,
    playRound,
    resetGame,
  }
}

function GameRules(gameboard, getTurn) {
  const lineCheckLoop = (isHorizontal) => {
    let mostConsecutive = 0;
    for (let x = 0; x < 3; x++) {
      let numberCount = 0;
      for (let y = 0; y < 3; y++) {
        const marker = (isHorizontal) ? gameboard.getMarker(x, y) : gameboard.getMarker(y, x);
        if (marker === getTurn()) {
          numberCount++;
        }
      }
      mostConsecutive = Math.max(mostConsecutive, numberCount);
    }
    return mostConsecutive;
  }

  const horizontalCheck = () => {
    let mostConsecutive = lineCheckLoop(true);
    return mostConsecutive;
  }
  
  const verticalCheck = () => {
    let mostConsecutive = lineCheckLoop(false)
    return mostConsecutive;
  }
  
  const diagonalCheck = () => {
    if ((gameboard.getMarker(0, 0) === getTurn() &&
      gameboard.getMarker(1, 1) === getTurn() &&
      gameboard.getMarker(2, 2) === getTurn()) ||
      (gameboard.getMarker(0, 2) === getTurn() &&
        gameboard.getMarker(1, 1) === getTurn() &&
        gameboard.getMarker(2, 0) === getTurn())) {
      return 3;
    }
    return 0;
  }

  const checkWinner = () => {
    let isWinner = 0;
    const horizontal = horizontalCheck();
    const vertical = verticalCheck();
    const diagonal = diagonalCheck();

    if (horizontal === 3 || vertical === 3 || diagonal === 3) {
      isWinner = 1;
    }

    return isWinner;
  }

  const checkDraw = () => {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (gameboard.getMarker(x, y) === 0) {
          return 0;
        }
      }
    }
    return 1;
  }

  return {
    checkWinner,
    horizontalCheck,
    verticalCheck,
    diagonalCheck,
    checkDraw,
  }
}

function ScreenController() {
  const game = GameController();

  const handleCellPress = (e) => {
    const col = e.target.dataset.column;
    const row = e.target.dataset.row;
    game.playRound(row, col, e);
  }

  const createCell = (row, col) => {
    const gridCell = document.createElement('div');
    gridCell.classList.add('cell');
    gridCell.dataset.column = col;
    gridCell.dataset.row = row;
    gridCell.addEventListener('click', handleCellPress);
    return gridCell;
  }

  const gridContainer = document.querySelector('.grid-container');
  const displayGrid = () => {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const gridCell = createCell(x, y);
        gridContainer.appendChild(gridCell);
      }
    }
  }
  
  const handleResetClick = () => {
    game.resetGame();
    gridContainer.innerHTML = '';
    displayGrid();
  }

  const resetBtn = document.querySelector('.reset');
  resetBtn.addEventListener('click', handleResetClick)
  
  return {
    displayGrid,
    game,
  }
}

const screen = ScreenController();
screen.displayGrid();