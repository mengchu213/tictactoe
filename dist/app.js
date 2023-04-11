const gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
const gameHistory = [];
let gameEnded = false;
let currentMoveIndex = -1;

const cells = Array.from(document.querySelectorAll(".cell"));
const handleCellClick = (event) => {
  const clickedCell = event.target;
  const row = parseInt(clickedCell.getAttribute("data-row"));
  const col = parseInt(clickedCell.getAttribute("data-col"));
  if (gameBoard[row][col] === "" && !gameEnded) {
    gameBoard[row][col] = currentPlayer;
    gameHistory.push(JSON.parse(JSON.stringify(gameBoard)));
    currentMoveIndex = gameHistory.length - 1;
    checkForWin(row, col);
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateUI();
  }
};
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

const gameStatusElement = document.getElementById("game-status");
const updateUI = () => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      cell.textContent = gameBoard[row][col];
    }
  }
  const message = gameEnded
    ? `Player ${currentPlayer === "X" ? "O" : "X"} wins!`
    : `Player ${currentPlayer}'s turn`;
  gameStatusElement.textContent = message;
};

const handlePreviousButtonClick = () => {
  if (currentMoveIndex > 0) {
    currentMoveIndex--;
    gameBoard = JSON.parse(JSON.stringify(gameHistory[currentMoveIndex]));
    updateUI();
  }
};

const handleNextButtonClick = () => {
  if (currentMoveIndex < gameHistory.length - 1) {
    currentMoveIndex++;
    gameBoard = JSON.parse(JSON.stringify(gameHistory[currentMoveIndex]));
    updateUI();
  }
};

const handleResetButtonClick = () => {
  gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentPlayer = "X";
  gameHistory.length = 0;
  gameEnded = false;
  currentMoveIndex = -1;
  updateUI();
};

const checkForWin = (row, col) => {
  const winningPlayer = gameBoard[row][col];

  if (
    (gameBoard[row][0] === winningPlayer &&
      gameBoard[row][1] === winningPlayer &&
      gameBoard[row][2] === winningPlayer) ||
    (gameBoard[0][col] === winningPlayer &&
      gameBoard[1][col] === winningPlayer &&
      gameBoard[2][col] === winningPlayer) ||
    (row === col &&
      gameBoard[0][0] === winningPlayer &&
      gameBoard[1][1] === winningPlayer &&
      gameBoard[2][2] === winningPlayer) ||
    (row + col === 2 &&
      gameBoard[0][2] === winningPlayer &&
      gameBoard[1][1] === winningPlayer &&
      gameBoard[2][0] === winningPlayer)
  ) {
    gameEnded = true;
  }
};

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const resetButton = document.getElementById("reset");

previousButton.addEventListener("click", handlePreviousButtonClick);
nextButton.addEventListener("click", handleNextButtonClick);
resetButton.addEventListener("click", handleResetButtonClick);
