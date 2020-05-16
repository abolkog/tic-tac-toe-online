import React, { useState } from 'react';

const CreateGame = ({ onFormSubmit }) => {
  const [name, setName] = useState('');

  return (
    <div>
      <h4>Create new game</h4>
      <div className="form-group row">
        <div className="col">
          <input
            type="text"
            placeholder="Enter your name"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col">
          <button onClick={() => onFormSubmit(name)} className="btn btn-info">
            Create Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
