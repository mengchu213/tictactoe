const prevButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

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
    clickedCell.textContent = currentPlayer;
    updateUI();
    saveMove();
    const winner = checkWinner();
    if (winner) {
      gameEnded = true;
      currentPlayer = winner === "Tie" ? currentPlayer : winner;
      updateUI();
      return;
    }
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
    ? `Player ${currentPlayer} wins!`
    : `Player ${currentPlayer}'s turn`;
  gameStatusElement.textContent = message;
};

const saveMove = () => {
  gameHistory.push(JSON.parse(JSON.stringify(gameBoard)));
};

const checkWinner = () => {};

const updateGameBoardFromHistory = (index) => {
  gameBoard = JSON.parse(JSON.stringify(gameHistory[index]));
  updateUI();
};

const handlePrevClick = () => {
  if (currentMoveIndex > 0) {
    currentMoveIndex--;
    updateGameBoardFromHistory(currentMoveIndex);
  }
};

const handleNextClick = () => {
  if (currentMoveIndex < gameHistory.length - 1) {
    currentMoveIndex++;
    updateGameBoardFromHistory(currentMoveIndex);
  }
};
