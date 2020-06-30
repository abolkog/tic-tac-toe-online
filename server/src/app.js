const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

const { makeKey } = require('./util');
const { createGame, getGame, updateGame } = require('./data/games');
const { createPlayer, getPlayer, removePlayer } = require('./data/players');

const PORT = process.env.PORT || 5001;

io.on('connection', socket => {
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

    socket.emit('notification', {
      message: `The game has been created. Game id: ${gameId}. Send this to your friend to join you`,
    });
    socket.emit('notification', {
      message: 'Waiting for opponent ...',
    });
  });

  socket.on('moveMade', data => {
    const { player, square, gameId } = data;
    // Get the game
    const game = getGame(gameId);
    // FIXME: check if game is valid and move is valid

    // update the board
    const { playBoard = [], playerTurn, player1, player2 } = game;
    playBoard[square] = player.symbol;

    // update the player turn
    const nextTurnId = playerTurn === player1 ? player2 : player1;

    // Update the game object
    game.playerTurn = nextTurnId;
    game.playBoard = playBoard;
    updateGame(game);

    // Check winning status or Draw
  });
});

server.listen(PORT, () => {
  console.log(`Server is ready to play on port ${PORT}`);
});
