import React from 'react';
import Square from './Square';

const Board = ({ game, player, onSquareClick }) => {
  const { playBoard = [], status = 'waiting' } = game;
  const enabled = status === 'playing';
  const canPlay = player.id === game.playerTurn;
  return (
    <div className="board">
      {playBoard.map((item, index) => {
        return (
          <Square
            key={index}
            value={item}
            index={index}
            onClick={() => onSquareClick(index)}
            enabled={enabled}
            canPlay={canPlay}
          />
        );
      })}
    </div>
  );
};

export default Board;
