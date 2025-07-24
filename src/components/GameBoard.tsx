import React from 'react';
import { GameState } from '../types/tetris';
import { TETROMINO_COLORS } from '../utils/tetrominoes';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/gameLogic';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const renderBoard = () => {
    const displayBoard = gameState.board.map(row => [...row]);
    
    // Add current piece to display board
    if (gameState.currentPiece) {
      const { shape, position, type } = gameState.currentPiece;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = type;
            }
          }
        }
      }
    }
    
    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`
              w-6 h-6 border border-gray-600/30 transition-all duration-150
              ${cell ? 
                `${TETROMINO_COLORS[cell as keyof typeof TETROMINO_COLORS]} shadow-lg border-white/20` : 
                'bg-gray-900/20 hover:bg-gray-800/30'
              }
            `}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="relative bg-gray-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl" />
      <div className="relative">
        {renderBoard()}
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">GAME OVER</h2>
              <p className="text-cyan-400">Press R to restart</p>
            </div>
          </div>
        )}
        {gameState.paused && !gameState.gameOver && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">PAUSED</h2>
              <p className="text-cyan-400">Press P to continue</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};