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
  };

  const getBoard = () => board;

  const getMarker = (x, y) => getBoard()[x][y].getValue();

  const setMarker = (x, y, playerCode) => {
    getBoard()[x][y].setValue(playerCode);
  };

  const resetBoard = () => {
    for (let x = 0; x < rowCount; x++) {
      for (let y = 0; y < colCount; y++) {
        getBoard()[x][y].setValue(0);
      }
    }
    generateBoard();
  };

  return {
    generateBoard,
    getBoard,
    getMarker,
    setMarker,
    resetBoard,
  };
}

function Cell() {
  let value = 0; // 0: Empty, 1: You, 2: Opponent

  const getValue = () => value;

  const setValue = (playerCode) => {
    value = playerCode;
  };

  return {
    getValue,
    setValue,
  };
}

function GameController() {
  const gameboard = Gameboard();
  let playerOne = 'Player 1';
  let playerTwo = 'Player 2';

  gameboard.generateBoard();

  let turn = 1; // 1: Player One, 2: Player Two
  let isGameFinished = 0;

  const getTurn = () => turn;

  const setNextTurn = () => (turn = turn === 1 ? 2 : 1);

  const rules = GameRules(gameboard, getTurn);

  const playRound = (x, y, e) => {
    if (isGameFinished) {
      console.log(`Please start a new game`);
      return;
    }

    if (gameboard.getMarker(x, y) > 0) {
      console.log("Choose another one");
      return;
    }

    screen.changeTurnMark();
    gameboard.setMarker(x, y, getTurn());
    e.target.textContent = turn === 1 ? "O" : "X";

    const hasWinner = rules.checkWinner();
    if (hasWinner) {
      console.log(`Player ${getTurn()} Won the game!`);
      screen.highlightWinningCells(hasWinner);
      finishGame();
      return;
    }

    const isDraw = rules.checkDraw();
    if (isDraw) {
      console.log(`Tie! It's a Draw!`);
      screen.highlightOnDraw();
      finishGame();
      return;
    }

    setNextTurn();
  };

  const getPlayerOne = () => playerOne;

  const getPlayerTwo = () => playerTwo;

  const setPlayerOne = (name) => playerOne = name;

  const setPlayerTwo = (name) => playerTwo = name;

  const finishGame = () => (isGameFinished = 1);

  const resetGame = () => {
    turn = 1;
    isGameFinished = 0;
    gameboard.resetBoard();
  };

  return {
    gameboard,
    playRound,
    resetGame,
    getTurn,
    setNextTurn,
    getPlayerOne,
    getPlayerTwo,
    setPlayerOne,
    setPlayerTwo,
  };
}

function GameRules(gameboard, getTurn) {
  const lineCheckLoop = (isHorizontal) => {
    let mostConsecutive = [];
    for (let x = 0; x < 3; x++) {
      let consecutive = [];
      for (let y = 0; y < 3; y++) {
        const marker = isHorizontal
          ? gameboard.getMarker(x, y)
          : gameboard.getMarker(y, x);

        if (marker === getTurn()) {
          isHorizontal ? consecutive.push([y, x]) : consecutive.push([x, y]);
        }
      }
      mostConsecutive =
        mostConsecutive.length > consecutive.length
          ? mostConsecutive
          : consecutive;
    }
    return mostConsecutive;
  };

  const horizontalCheck = () => {
    let mostConsecutive = lineCheckLoop(true);
    return mostConsecutive;
  };

  const verticalCheck = () => {
    let mostConsecutive = lineCheckLoop(false);
    return mostConsecutive;
  };

  const diagonalCheck = () => {
    let diagonalWin = [];

    if (
      gameboard.getMarker(0, 0) === getTurn() &&
      gameboard.getMarker(1, 1) === getTurn() &&
      gameboard.getMarker(2, 2) === getTurn()
    ) {
      diagonalWin = [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
    }

    if (
      gameboard.getMarker(0, 2) === getTurn() &&
      gameboard.getMarker(1, 1) === getTurn() &&
      gameboard.getMarker(2, 0) === getTurn()
    ) {
      diagonalWin = [
        [0, 2],
        [1, 1],
        [2, 0],
      ];
    }

    return diagonalWin;
  };

  const checkWinner = () => {
    let isWinner = 0;
    const horizontal = horizontalCheck();
    const vertical = verticalCheck();
    const diagonal = diagonalCheck();

    if (horizontal.length === 3) {
      isWinner = horizontal;
    }

    if (vertical.length === 3) {
      isWinner = vertical;
    }

    if (diagonal.length === 3) {
      isWinner = diagonal;
    }

    return isWinner;
  };

  const checkDraw = () => {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (gameboard.getMarker(x, y) === 0) {
          return 0;
        }
      }
    }
    return 1;
  };

  return {
    checkWinner,
    horizontalCheck,
    verticalCheck,
    diagonalCheck,
    checkDraw,
  };
}

function ScreenController() {
  const game = GameController();

  const handleCellPress = (e) => {
    const col = e.target.dataset.column;
    const row = e.target.dataset.row;
    game.playRound(row, col, e);
  };

  const createCell = (row, col) => {
    const gridCell = document.createElement("div");
    gridCell.classList.add("cell");
    gridCell.dataset.column = col;
    gridCell.dataset.row = row;
    gridCell.addEventListener("click", handleCellPress);
    return gridCell;
  };

  const gridContainer = document.querySelector(".grid-container");
  const displayGrid = () => {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const gridCell = createCell(x, y);
        gridContainer.appendChild(gridCell);
      }
    }
  };

  const handleResetClick = () => {
    const turn = document.querySelector(".turn");
    turn.textContent = "O";
    game.resetGame();
    gridContainer.innerHTML = "";
    displayGrid();
  };

  const highlightWinningCells = (winner) => {
    winner.map((cell) => {
      const col = cell[0];
      const row = cell[1];
      const cellInGrid = document.querySelector(
        `[data-column="${col}"][data-row="${row}"]`
      );
      cellInGrid.classList.add("winning-cell");
    });
  };

  const highlightOnDraw = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      const cellMark = cell.textContent;
      if (cellMark === "O") {
        cell.classList.add("player-one-draw");
      } else {
        cell.classList.add("player-two-draw");
      }
    });
  };

  const changeTurnMark = () => {
    const turn = document.querySelector(".turn");
    turn.textContent = game.getTurn() === 1 ? "X" : "O";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const playerOne = document.querySelector('#player-one').value;
    const playerTwo = document.querySelector('#player-two').value;

    game.setPlayerOne(playerOne);
    game.setPlayerTwo(playerTwo);

    handleCloseModal();
  }

  const resetBtn = document.querySelector(".reset");
  resetBtn.addEventListener("click", handleResetClick);
  
  const profileForm = document.querySelector('.profile-form');
  profileForm.addEventListener('submit', handleSubmit);
  
  const iconContainer = document.querySelector(".icon-container");
  const profileModal = document.querySelector(".profile-modal");
  const closeModal = document.querySelector(".close-modal");
  const backdrop = document.querySelector(".backdrop");
  
  const handleCloseModal = () => {
    profileModal.classList.remove("show");
    profileModal.classList.add("hide");
    backdrop.classList.remove("show");
    backdrop.classList.add("hide");
  
    profileModal.close();
  
    setTimeout(() => {
      profileModal.style.display = "none";
      backdrop.classList.remove("hide");
    }, 200);
  }

  iconContainer.addEventListener("click", () => {
    profileModal.style.display = "flex";
    
    setTimeout(() => {
      backdrop.classList.add("show");
      profileModal.classList.remove("hide");
      profileModal.classList.add("show");
      profileModal.showModal();
    }, 50);
  });

  closeModal.addEventListener("click", () => {
    handleCloseModal();
  });

  return {
    displayGrid,
    game,
    highlightWinningCells,
    changeTurnMark,
    highlightOnDraw,
  };
}

const screen = ScreenController();
screen.displayGrid();
