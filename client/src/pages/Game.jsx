import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from '../components/Board';

let socket;

const Game = ({ name, gameId }) => {
  const SERVER_ENDPOINT = 'http://localhost:5001';
  const [player, setPlayer] = useState({});
  const [game, setGame] = useState({});

  useEffect(() => {
    const event = gameId ? 'joinGame' : 'createGame';
    socket = new io(SERVER_ENDPOINT);
    socket.emit(event, { name });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [SERVER_ENDPOINT, gameId, name]);

  useEffect(() => {
    socket.on('playerCreated', (data) => {
      const { player } = data;
      setPlayer(player);
    });

    socket.on('gameUpdated', (data) => {
      const { game } = data;
      setGame(game);
    });
  });

  const onSquareClick = (value) => {
    console.log(`Player ${player.name} clicked ${value}`);
  };

  return (
    <div>
      {player && (
        <h5>
          Welcome {player.name}.{' '}
          <strong>You are playing {player.symbol}</strong>
        </h5>
      )}
      {game && <h5>Game ID: {game.id}</h5>}
      <hr />
      <Board player={player} game={game} onSquareClick={onSquareClick} />
    </div>
  );
};

export default Game;
