const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

const { makeKey, checkWinner } = require('./util');
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

  socket.on('joinGame', ({ name, gameId }) => {
    // Check game id
    const game = getGame(gameId);
    if (!game) {
      socket.emit('notification', {
        message: 'Invalid game id',
      });
      return;
    }
    // Check Max player
    if (game.player2) {
      socket.emit('notification', {
        message: 'Game is full',
      });
      return;
    }
    // Create player
    const player = createPlayer(socket.id, name, game.id, 'O');
    // Update  the game
    game.player2 = player.id;
    game.status = 'playing';
    updateGame(game);

    // notify other player
    socket.join(gameId);
    socket.emit('playerCreated', { player });
    socket.emit('gameUpdated', { game });

    socket.broadcast.emit('gameUpdated', { game });
    socket.broadcast.emit('notification', {
      message: `${name} has joined the game.`,
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

    // Brodcast game update to everyone
    io.in(gameId).emit('gameUpdated', { game });

    // Check winning status or Draw
    const hasWon = checkWinner(playBoard);
    if (hasWon) {
      const winner = { ...hasWon, player };
      game.status = 'gameOver';
      updateGame(game);
      io.in(gameId).emit('gameUpdated', { game });
      io.in(gameId).emit('gameEnd', { winner });
      return;
    }

    // Checking Draw
    const emptySquareIndex = playBoard.findIndex(item => item === null);
    if (emptySquareIndex === -1) {
      game.status = 'gameOver';
      updateGame(game);
      io.in(gameId).emit('gameUpdated', { game });
      io.in(gameId).emit('gameEnd', { winner: null });
      return;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is ready to play on port ${PORT}`);
});
