import React from 'react';
import Square from './Square';

const Board = ({ game, player, onSquareClick }) => {
  const { playBoard = [] } = game;

  return (
    <div className="board">
      {playBoard.map((item, index) => {
        return (
          <Square
            key={index}
            value={item}
            index={index}
            onClick={() => onSquareClick(index)}
          />
        );
      })}
    </div>
  );
};

export default Board;
