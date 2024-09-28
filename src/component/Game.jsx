import React, { useEffect, useMemo, useReducer } from 'react';
import Board from './Board';
import MoveHistory from './MoveHistory';

const initialBoardState = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

const initialState = {
  move: 0,
  gameState: [initialBoardState],
  winner: null,
};

function query(state, action) {
  switch (action.type) {
    case 'nextMove': {
      return {
        ...state,
        move: state.move + 1,
        gameState: [
          ...state.gameState.slice(0, state.move + 1),
          action.payload,
        ],
      };
    }
    case 'declareWinner': {
      return {
        ...state,
        winner: action.payload,
      };
    }
    case 'currentMove': {
      return {
        ...state,
        move: action.payload,
        winner: null, // Reset winner when jumping to a previous move
      };
    }
    case 'undoMove': {
      return {
        ...state,
        move: state.move - 1,
      };
    }
    case 'redoMove': {
      return {
        ...state,
        move: state.move + 1,
        gameState: gameState[state.move + 1],
      };
    }
    default:
      return state;
  }
}

function Game() {
  const [{ gameState, move, winner }, dispatch] = useReducer(
    query,
    initialState
  );

  const boardState = useMemo(() => gameState[move], [gameState, move]);

  function handleMove(rowIndex, columnIndex) {
    if (boardState[rowIndex][columnIndex] === '' && !winner) {
      const newBoardState = boardState.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === rowIndex && cIdx === columnIndex) {
            return move % 2 === 0 ? 'X' : 'O';
          }
          return cell;
        })
      );

      dispatch({
        type: 'nextMove',
        payload: newBoardState,
      });

      checkIfPlayerWon(newBoardState);
    }
  }

  function checkIfPlayerWon(board) {
    const playerSymbol = move % 2 === 0 ? 'X' : 'O';

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i].every((cell) => cell === playerSymbol)) {
        dispatch({
          type: 'declareWinner',
          payload: playerSymbol,
          winningLine: '',
        });
        return;
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board.every((row) => row[i] === playerSymbol)) {
        dispatch({ type: 'declareWinner', payload: playerSymbol });
        return;
      }
    }

    // Check diagonals
    if (
      (board[0][0] === playerSymbol &&
        board[1][1] === playerSymbol &&
        board[2][2] === playerSymbol) ||
      (board[0][2] === playerSymbol &&
        board[1][1] === playerSymbol &&
        board[2][0] === playerSymbol)
    ) {
      dispatch({ type: 'declareWinner', payload: playerSymbol });
      return;
    }

    // Check for draw (no more empty cells)
    if (board.flat().every((cell) => cell !== '')) {
      dispatch({ type: 'declareWinner', payload: 'Draw' });
    }
  }

  function jumpTo(index) {
    dispatch({
      type: 'currentMove',
      payload: index,
    });
  }

  function undoMove() {
    if (move > 0) {
      dispatch({ type: 'undoMove' });
    }
  }

  function redoMove() {
    if (move < gameState.length - 1) {
      dispatch({ type: 'redoMove' });
    }
  }

  return (
    <div>
      {winner ? (
        <h2>{winner === 'Draw' ? "It's a draw!" : `Player ${winner} wins!`}</h2>
      ) : (
        <h3>Next player: {move % 2 === 0 ? 'X' : 'O'}</h3>
      )}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Board boardState={boardState} handleMove={handleMove} />
        <MoveHistory gameState={gameState} jumpTo={jumpTo} />
      </div>
    </div>
  );
}

export default Game;
