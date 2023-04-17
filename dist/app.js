const gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
// const gameHistory = [];
const gameHistoryData = [];
let gameEnded = false;
let currentMoveIndex = -1;

const cells = Array.from(document.querySelectorAll(".cell"));
let playWithAI = false;
let difficulty = "easy";

const makeMove = (row, col) => {
  gameBoard[row][col] = currentPlayer;
  gameHistory.push(JSON.parse(JSON.stringify(gameBoard)));
  currentMoveIndex = gameHistory.length - 1;
  gameEnded = checkForWin(row, col);
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateUI();

  gameHistoryData.push(JSON.parse(JSON.stringify(gameBoard)));
};

const handleCellClick = (event) => {
  const clickedCell = event.target;
  const row = parseInt(clickedCell.getAttribute("data-row"));
  const col = parseInt(clickedCell.getAttribute("data-col"));
  if (gameBoard[row][col] === "" && !gameEnded) {
    makeMove(row, col);

    if (playWithAI && !gameEnded) {
      const depth = difficulty === "easy" ? 2 : 6;
      const bestMove = getBestMoveUsingMinimax(
        gameBoard,
        currentPlayer,
        depth,
        difficulty
      );
      if (bestMove) {
        makeMove(bestMove.row, bestMove.col);
      }
    }
  }
};

const checkForWinAI = (board, player) => {
  const winConditions = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],

    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  return winConditions.some((condition) => {
    return condition.every(([row, col]) => {
      return board[row][col] === player;
    });
  });
};

const getAvailableMoves = (board) => {
  const moves = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        moves.push({ row, col });
      }
    }
  }
  return moves;
};

const minimaxWithAlphaBetaPruning = (
  board,
  depth,
  alpha,
  beta,
  isMaximizingPlayer,
  currentPlayer,
  difficulty
) => {
  const opponent = currentPlayer === "X" ? "O" : "X";
  const winner = checkForWinAI(board, currentPlayer);

  if (winner) {
    return winner === currentPlayer ? 10 - depth : depth - 10;
  }

  if (depth === 0 || getAvailableMoves(board).length === 0) {
    return 0;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    const availableMoves = getAvailableMoves(board);
    for (const move of availableMoves) {
      const { row, col } = move;
      board[row][col] = currentPlayer;
      const score = minimaxWithAlphaBetaPruning(
        board,
        depth - 1,
        alpha,
        beta,
        false,
        currentPlayer
      );
      board[row][col] = "";
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    const availableMoves = getAvailableMoves(board);
    for (const move of availableMoves) {
      const { row, col } = move;
      board[row][col] = opponent;
      const score = minimaxWithAlphaBetaPruning(
        board,
        depth - 1,
        alpha,
        beta,
        true,
        currentPlayer
      );
      board[row][col] = "";
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, bestScore);

      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  }
};

const getBestMoveUsingMinimax = (board, currentPlayer, depth, difficulty) => {
  const availableMoves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = null;

  for (const move of availableMoves) {
    const { row, col } = move;
    board[row][col] = currentPlayer;
    const score = minimaxWithAlphaBetaPruning(
      board,
      depth,
      -Infinity,
      Infinity,
      false,
      currentPlayer,
      difficulty
    );

    board[row][col] = "";
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

const handlePreviousButtonClick = () => {
  if (currentMoveIndex > 0) {
    currentMoveIndex--;
    updateGameBoard(gameHistory[currentMoveIndex]);
    updateUI();
  }
};

const handleNextButtonClick = () => {
  if (currentMoveIndex < gameHistory.length - 1) {
    currentMoveIndex++;
    updateGameBoard(gameHistory[currentMoveIndex]);
    updateUI();
  }
};

const handleResetButtonClick = () => {
  updateGameBoard([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  currentPlayer = "X";
  gameHistory.length = 0;
  gameEnded = false;
  currentMoveIndex = -1;
  updateUI();
};
const gameHistory = [
  [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["X", "O", "X"],
  ],
  [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["X", "O", "O"],
  ],
];

function showHistory() {
  let historyString = "";
  for (let i = 0; i < gameHistory.length; i++) {
    historyString += `Move ${i + 1}: ${gameHistory[i]}\n`;
  }
  alert(historyString);
  const historyElement = document.createElement("pre");
  historyElement.textContent = historyString;
  document.body.appendChild(historyElement);
}
const updateGameBoard = (newBoard) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      gameBoard[row][col] = newBoard[row][col];
    }
  }
};

const checkForWin = (row, col) => {
  const winningPlayer = gameBoard[row][col];

  return (
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
  );
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

  const winnerInfoElement = document.getElementById("winner-info");
  if (gameEnded) {
    const winner = currentPlayer === "X" ? "O" : "X";
    winnerInfoElement.textContent = `Player ${winner} wins!`;
  } else if (getAvailableMoves(gameBoard).length === 0) {
    winnerInfoElement.textContent = `It's a tie!`;
  } else {
    winnerInfoElement.textContent = `Player ${currentPlayer}'s turn`;
  }
};

const gameBoardElement = document.getElementById("game-board");
gameBoardElement.style.display = "none";
cells.forEach((cell) => {
  cell.style.display = "none";
});

const oneVsOneButton = document.getElementById("one-vs-one");
const playVsAIButton = document.getElementById("play-vs-ai");
const mainMenu = document.getElementById("main-menu");

const gameControls = document.getElementById("game-controls");

const playWithAIButton = document.createElement("button");
playWithAIButton.id = "play-with-ai";
playWithAIButton.innerText = "Play with AI";
const difficultySelect = document.createElement("select");
difficultySelect.id = "difficulty";
const easyOption = document.createElement("option");
easyOption.value = "easy";
easyOption.innerText = "Easy";
difficultySelect.appendChild(easyOption);
const nightmareOption = document.createElement("option");
nightmareOption.value = "nightmare";
nightmareOption.innerText = "Nightmare";
difficultySelect.appendChild(nightmareOption);
difficultySelect.addEventListener("change", (event) => {
  difficulty = event.target.value;
});
playWithAIButton.addEventListener("click", () => {
  const depth = difficulty === "easy" ? 2 : 6;
  const bestMove = getBestMoveUsingMinimax(
    gameBoard,
    currentPlayer,
    depth,
    difficulty
  );
  if (bestMove) {
    makeMove(bestMove.row, bestMove.col);
  }
});

oneVsOneButton.addEventListener("click", () => {
  playWithAI = false;
  mainMenu.style.display = "none";
  gameBoardElement.style.display = "grid";
  cells.forEach((cell) => {
    cell.style.display = "inline";
  });
  gameControls.style.display = "flex";
  if (gameControls.contains(playWithAIButton)) {
    gameControls.removeChild(playWithAIButton);
    gameControls.removeChild(difficultySelect);
  }
  document.getElementById("current-turn-display").classList.remove("hidden");
});

playVsAIButton.addEventListener("click", () => {
  playWithAI = true;
  mainMenu.style.display = "none";
  gameBoardElement.style.display = "grid";
  cells.forEach((cell) => {
    cell.style.display = "inline";
  });
  gameControls.style.display = "flex";
  if (!gameControls.contains(playWithAIButton)) {
    gameControls.appendChild(playWithAIButton);
    gameControls.appendChild(difficultySelect);
    playWithAIButton.addEventListener("click", () => {
      const depth = difficulty === "easy" ? 2 : 6;
      const bestMove = getBestMoveUsingMinimax(
        gameBoard,
        currentPlayer,
        depth,
        difficulty
      );
      if (bestMove) {
        const { row, col } = bestMove;
        gameBoard[row][col] = currentPlayer;
        gameHistory.push(JSON.parse(JSON.stringify(gameBoard)));
        currentMoveIndex = gameHistory.length - 1;
        checkForWin(row, col);
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateUI();
      }
      document
        .getElementById("current-turn-display")
        .classList.remove("hidden");

      if (currentPlayer === "O") {
        const depth = difficulty === "easy" ? 2 : 6;
        const bestMove = getBestMoveUsingMinimax(
          gameBoard,
          currentPlayer,
          depth,
          difficulty
        );
        if (bestMove) {
          makeMove(bestMove.row, bestMove.col);
        }
      }
    });
  }
  difficultySelect.addEventListener("change", (event) => {
    difficulty = event.target.value;
  });
});
const historyButton = document.getElementById("history");
console.log("Script loaded");

if (historyButton) {
  console.log("History button found");
  historyButton.addEventListener("click", () => {
    console.log("History button clicked");
    showHistory();
  });
} else {
  console.error("History button not found");
}

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const resetButton = document.getElementById("reset");

previousButton.addEventListener("click", handlePreviousButtonClick);
nextButton.addEventListener("click", handleNextButtonClick);
resetButton.addEventListener("click", handleResetButtonClick);

updateUI();
