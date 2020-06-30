import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from '../components/Board';

let socket;

const Game = ({ name, gameId }) => {
  const SERVER_ENDPOINT = 'http://localhost:5001';
  const [player, setPlayer] = useState({});
  const [game, setGame] = useState({});
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const event = gameId ? 'joinGame' : 'createGame';
    socket = new io(SERVER_ENDPOINT);
    socket.emit(event, { name, gameId });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [SERVER_ENDPOINT, gameId, name]);

  useEffect(() => {
    socket.on('notification', data => {
      const { message = '' } = data;
      notification.push(message);
      setNotification([...notification]);
    });
  }, [notification]);

  useEffect(() => {
    socket.on('playerCreated', data => {
      const { player } = data;
      setPlayer(player);
    });

    socket.on('gameUpdated', data => {
      const { game } = data;
      setGame(game);
    });
  });

  const onSquareClick = value => {
    socket.emit('moveMade', {
      square: value,
      player,
      gameId: game.id,
    });
  };

  const turnMessage =
    game.playerTurn === player.id ? 'Your Move' : 'Opponunt Turn';

  return (
    <div>
      {player && (
        <h5>
          Welcome {player.name}.{' '}
          <strong>You are playing {player.symbol}</strong>
        </h5>
      )}
      {game.status === 'playing' && <h5>{turnMessage}</h5>}
      {game && <h5>Game ID: {game.id}</h5>}
      <hr />
      <Board player={player} game={game} onSquareClick={onSquareClick} />
      {notification.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
};

export default Game;
