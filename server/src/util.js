const makeKey = (length = 5) => {
  return Math.random().toString(36).substr(2, length);
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = board => {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winningCombination: [a, b, c],
      };
    }
  }
  return null;
};

module.exports = { makeKey, checkWinner };
