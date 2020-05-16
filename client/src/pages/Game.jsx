import React from 'react';

const Game = ({ name, gameId }) => {
  const event = gameId ? 'Join game' : 'Create Game';
  console.log(`${name} wants to ${event}`);
  return <div>Game</div>;
};

export default Game;
