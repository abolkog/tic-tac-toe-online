import React from 'react';

const Square = ({ value, index, onClick }) => {
  return (
    <div className="square">
      <button onClick={onClick} className="square-item">
        {index}
      </button>
    </div>
  );
};

export default Square;
