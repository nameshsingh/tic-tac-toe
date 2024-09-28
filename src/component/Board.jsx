import React from 'react';
import style from './Board.module.css';

function Board({ boardState, handleMove }) {
  return (
    <div className={style.board}>
      {boardState.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className={style.row}>
            {row.map((square, colIndex) => (
              <div
                onClick={() => handleMove(rowIndex, colIndex)}
                key={`${rowIndex}-${colIndex}`}
                className={style.square}
              >
                {square}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
