import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Board from '../components/Board';

let socket;

const Game = ({ name, gameId }) => {
  const SERVER_ENDPOINT = 'http://localhost:5001';
  const [winner, setWinner] = useState(null);
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

    socket.on('gameEnd', data => {
      const { winner } = data;
      setWinner(winner);
    });
  });

  const onSquareClick = value => {
    socket.emit('moveMade', {
      square: value,
      player,
      gameId: game.id,
    });
  };

  const getWinnerMessage = () => {
    return winner.player.id === player.id ? 'You Win' : 'You Loose';
  };

  const turnMessage =
    game.playerTurn === player.id ? 'Your Move' : 'Opponunt Turn';

  const winnerMessage = winner ? getWinnerMessage() : 'Draw game';

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

      {game.status === 'gameOver' && (
        <div className="alert alert-info">{winnerMessage}</div>
      )}
      <hr />
      <Board
        player={player}
        game={game}
        onSquareClick={onSquareClick}
        winner={winner}
      />
      {notification.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
};

export default Game;
