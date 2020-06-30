import React from 'react';

const Square = ({ value, index, onClick, canPlay, enabled }) => {
  const canSelect = !value && enabled && canPlay;
  const btnClassName = canSelect ? '' : 'disabled';
  return (
    <div className="square">
      <button
        onClick={onClick}
        className={`square-item ${btnClassName}`}
        disabled={!canSelect}
      >
        {index}
      </button>
    </div>
  );
};

export default Square;
