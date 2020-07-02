import React from 'react';
import Square from './Square';

const Board = ({ game, player, onSquareClick, winner }) => {
  const { playBoard = [], status = 'waiting' } = game;
  const enabled = status === 'playing';
  const canPlay = player.id === game.playerTurn;
  const { winningCombination = [] } = winner || {};

  return (
    <div className="board">
      {playBoard.map((item, index) => {
        const isWinnerSquare = winningCombination.includes(index);
        return (
          <Square
            key={index}
            value={item}
            onClick={() => onSquareClick(index)}
            enabled={enabled}
            canPlay={canPlay}
            isWinnerSquare={isWinnerSquare}
          />
        );
      })}
    </div>
  );
};

export default Board;
