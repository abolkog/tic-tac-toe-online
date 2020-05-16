const games = [];

const createGame = (id, player1, player2) => {
  const game = {
    id,
    player1,
    player2,
    playerTurn: player1,
    playBoard: Array(9).fill(null),
    status: 'waiting',
    winner: null,
  };
  games.push(games);
  return game;
};

module.exports = { createGame };
