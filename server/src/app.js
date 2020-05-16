const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

const { makeKey } = require('./util');
const { createGame } = require('./data/games');
const { createPlayer, getPlayer, removePlayer } = require('./data/players');

const PORT = process.env.PORT || 5001;

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    const player = getPlayer(socket.id);
    if (player) {
      removePlayer(player.id);
    }
  });

  // Player create new game
  socket.on('createGame', ({ name }) => {
    const gameId = `game-${makeKey()}`;

    const player = createPlayer(socket.id, name, gameId, 'X');

    const game = createGame(gameId, player.id, null);

    socket.join(gameId);
    socket.emit('playerCreated', { player });
    socket.emit('gameUpdated', { game });
  });
});

server.listen(PORT, () => {
  console.log(`Server is ready to play on port ${PORT}`);
});
