const games = [];

const createGame = (id, player1, player2) => {
  const newGame = {
    id,
    player1,
    player2,
    playerTurn: player1,
    playBoard: Array(9).fill(null),
    status: 'waiting',
    winner: null,
  };
  games.push(newGame);
  return newGame;
};

const updateGame = game => {
  const index = games.findIndex(g => g.id === game.id);
  if (index !== -1) {
    games[index] = game;
  }
};

const getGame = id => games.find(game => game.id === id);

module.exports = { createGame, updateGame, getGame };
