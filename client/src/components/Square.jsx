import React from 'react';

const Square = ({ value, onClick, canPlay, enabled, isWinnerSquare }) => {
  const canSelect = !value && enabled && canPlay;
  const btnClassName = canSelect ? '' : 'disabled';
  const winningClass = isWinnerSquare ? 'square-win' : '';
  return (
    <div className={`square ${winningClass}`}>
      <button
        onClick={onClick}
        className={`square-item ${btnClassName}`}
        disabled={!canSelect}
      >
        {value}
      </button>
    </div>
  );
};

export default Square;
