window.onload = function() {
    const board = document.getElementById('board');
    const gameStatus = document.getElementById('game-status');
    const resetBtn = document.getElementById('reset-btn');
    const gameOverModal = document.getElementById('game-over-modal');
    const resultMessage = document.getElementById('result-message');
    const resultTitle = document.getElementById('result-title');
    const playAgainBtn = document.getElementById('play-again-btn');
    const playerSelectionModal = document.getElementById('player-selection-modal');
    const chooseXBtn = document.getElementById('choose-x-btn');
    const chooseOBtn = document.getElementById('choose-o-btn');
    
    let cells = [];
    let gameActive = false;
    let humanPlayer = '';
    let computerPlayer = '';
    let currentPlayer = 'X';
    
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Create the game board
    function createBoard() {
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
      }
    }
    
    // Handle player selection
    function handlePlayerSelection() {
      chooseXBtn.addEventListener('click', function() {
        humanPlayer = 'X';
        computerPlayer = 'O';
        playerSelectionModal.style.display = 'none';
        startGame();
      });
      
      chooseOBtn.addEventListener('click', function() {
        humanPlayer = 'O';
        computerPlayer = 'X';
        playerSelectionModal.style.display = 'none';
        startGame();
        
        // If computer is X, it goes first
        if (computerPlayer === 'X') {
          makeComputerMove();
        }
      });
    }
    
    // Start the game
    function startGame() {
      gameActive = true;
      currentPlayer = 'X';
      updateGameStatus();
    }
    
    // Handle cell click
    function handleCellClick() {
      const index = this.getAttribute('data-index');
      
      // Check if cell is already filled or game is not active or not human's turn
      if (this.textContent !== '' || !gameActive || currentPlayer !== humanPlayer) {
        return;
      }
      
      // Update cell
      makeMove(this, index, humanPlayer);
      
      // Check for win or draw
      if (checkWinner()) {
        endGame(false);
      } else if (isDraw()) {
        endGame(true);
      } else {
        // Switch to computer's turn
        currentPlayer = computerPlayer;
        updateGameStatus();
        
        // Computer makes move after a short delay
        setTimeout(makeComputerMove, 500);
      }
    }
    
    // Make a move for either player
    function makeMove(cell, index, player) {
      cell.textContent = player;
      cell.setAttribute('data-value', player);
      
      // Add animation
      cell.style.transform = 'scale(0.9)';
      setTimeout(() => {
        cell.style.transform = 'scale(1)';
      }, 100);
    }
    
    // Computer's move
    function makeComputerMove() {
      if (!gameActive) return;
      
      let bestMove = findBestMove();
      let selectedCell = cells[bestMove];
      
      makeMove(selectedCell, bestMove, computerPlayer);
      
      // Check for win or draw
      if (checkWinner()) {
        endGame(false);
      } else if (isDraw()) {
        endGame(true);
      } else {
        // Switch to human's turn
        currentPlayer = humanPlayer;
        updateGameStatus();
      }
    }
    
    // Find best move using the minimax algorithm
    function findBestMove() {
      // First, check if computer can win in the next move
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === '') {
          // Try this move
          cells[i].textContent = computerPlayer;
          
          // Check if this move wins
          if (checkWinner()) {
            cells[i].textContent = ''; // Reset
            return i;
          }
          
          cells[i].textContent = ''; // Reset
        }
      }
      
      // Second, check if player can win in the next move and block
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === '') {
          // Try this move for the human
          cells[i].textContent = humanPlayer;
          
          // Check if this move would let human win
          if (checkWinner()) {
            cells[i].textContent = ''; // Reset
            return i; // Block this move
          }
          
          cells[i].textContent = ''; // Reset
        }
      }
      
      // Take center if available
      if (cells[4].textContent === '') {
        return 4;
      }
      
      // Take corners if available
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(i => cells[i].textContent === '');
      if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
      
      // Take any available side
      const sides = [1, 3, 5, 7];
      const availableSides = sides.filter(i => cells[i].textContent === '');
      if (availableSides.length > 0) {
        return availableSides[Math.floor(Math.random() * availableSides.length)];
      }
      
      // Fallback: first available move
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === '') {
          return i;
        }
      }
      
      return -1; // No move available (shouldn't reach here)
    }
    
    // Check for winner
    function checkWinner() {
      return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return (
          cells[a].textContent &&
          cells[a].textContent === cells[b].textContent &&
          cells[b].textContent === cells[c].textContent
        );
      });
    }
    
    // Check for draw
    function isDraw() {
      return cells.every(cell => cell.textContent !== '');
    }
    
    // End the game
    function endGame(isDraw) {
      gameActive = false;
      
      if (isDraw) {
        resultTitle.textContent = "It's a Draw!";
        resultMessage.textContent = "The game ended in a draw.";
      } else {
        if (currentPlayer === humanPlayer) {
          resultTitle.textContent = "You Win!";
          resultMessage.textContent = "Congratulations on your victory!";
        } else {
          resultTitle.textContent = "Computer Wins!";
          resultMessage.textContent = "Better luck next time!";
        }
        
        // Highlight the winning cells
        highlightWinningCells();
      }
      
      // Show the modal after a short delay
      setTimeout(() => {
        gameOverModal.style.display = 'flex';
      }, 500);
    }
    
    // Highlight winning cells
    function highlightWinningCells() {
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (
          cells[a].textContent &&
          cells[a].textContent === cells[b].textContent &&
          cells[b].textContent === cells[c].textContent
        ) {
          const winningPlayer = cells[a].textContent;
          const bgColor = winningPlayer === 'X' ? '#fecaca' : '#bfdbfe';
          
          cells[a].style.backgroundColor = bgColor;
          cells[b].style.backgroundColor = bgColor;
          cells[c].style.backgroundColor = bgColor;
          break;
        }
      }
    }
    
    // Reset the game
    function resetGame() {
      gameActive = false;
      currentPlayer = 'X';
      
      cells.forEach(cell => {
        cell.textContent = '';
        cell.removeAttribute('data-value');
        cell.style.backgroundColor = '';
      });
      
      gameOverModal.style.display = 'none';
      playerSelectionModal.style.display = 'flex';
    }
    
    // Update game status display
    function updateGameStatus() {
      if (currentPlayer === humanPlayer) {
        gameStatus.textContent = "Your turn";
      } else {
        gameStatus.textContent = "Computer's turn";
      }
      
      // Add a visual indicator for current player
      if (currentPlayer === 'X') {
        gameStatus.style.color = 'var(--x-color)';
      } else {
        gameStatus.style.color = 'var(--o-color)';
      }
    }
    
    // Initialize the game
    createBoard();
    handlePlayerSelection();
    
    // Event listeners
    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', resetGame);
};