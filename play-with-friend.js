window.onload = function() {
    const board = document.getElementById('board');
    const gameStatus = document.getElementById('game-status');
    const resetBtn = document.getElementById('reset-btn');
    const modal = document.getElementById('game-over-modal');
    const resultMessage = document.getElementById('result-message');
    const resultTitle = document.getElementById('result-title');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    let currentPlayer = 'X';
    let cells = [];
    let gameActive = true;
    
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
    
    // Handle cell click
    function handleCellClick() {
      const index = this.getAttribute('data-index');
      
      // Check if cell is already filled or game is not active
      if (this.textContent !== '' || !gameActive) {
        return;
      }
      
      // Update cell
      this.textContent = currentPlayer;
      this.setAttribute('data-value', currentPlayer);
      
      // Add animation
      this.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 100);
      
      // Check for win or draw
      if (checkWinner()) {
        endGame(false);
      } else if (isDraw()) {
        endGame(true);
      } else {
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateGameStatus();
      }
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
        resultTitle.textContent = `Player ${currentPlayer} Wins!`;
        resultMessage.textContent = `Congratulations to Player ${currentPlayer}!`;
        
        // Highlight the winning cells
        highlightWinningCells();
      }
      
      // Show the modal after a short delay
      setTimeout(() => {
        modal.style.display = 'flex';
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
          cells[a].style.backgroundColor = currentPlayer === 'X' ? '#fecaca' : '#bfdbfe';
          cells[b].style.backgroundColor = currentPlayer === 'X' ? '#fecaca' : '#bfdbfe';
          cells[c].style.backgroundColor = currentPlayer === 'X' ? '#fecaca' : '#bfdbfe';
          break;
        }
      }
    }
    
    // Reset the game
    function resetGame() {
      gameActive = true;
      currentPlayer = 'X';
      
      cells.forEach(cell => {
        cell.textContent = '';
        cell.removeAttribute('data-value');
        cell.style.backgroundColor = '';
      });
      
      updateGameStatus();
      modal.style.display = 'none';
    }
    
    // Update game status display
    function updateGameStatus() {
      gameStatus.textContent = `Player ${currentPlayer}'s turn`;
      
      // Add a visual indicator for current player
      if (currentPlayer === 'X') {
        gameStatus.style.color = 'var(--x-color)';
      } else {
        gameStatus.style.color = 'var(--o-color)';
      }
    }
    
    // Initialize the game
    createBoard();
    updateGameStatus();
    
    // Event listeners
    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', resetGame);
};