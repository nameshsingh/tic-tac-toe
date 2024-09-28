import React from 'react';

function MoveHistory({ gameState, jumpTo }) {
  return (
    <div>
      {gameState.map((game, index) => (
        <div>
          <span>
            <strong>
              {index + 1}.
              <button onClick={() => jumpTo(index)}>
                {index == 0 ? 'Go to game start' : `Go to move ${index + 1}`}
              </button>
            </strong>
          </span>
        </div>
      ))}
    </div>
  );
}

export default MoveHistory;
