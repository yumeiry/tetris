import React from 'react';
import { Tetromino } from '../types/tetris';
import { TETROMINO_COLORS } from '../utils/tetrominoes';

interface NextPieceProps {
  nextPiece: Tetromino | null;
}

export const NextPiece: React.FC<NextPieceProps> = ({ nextPiece }) => {
  if (!nextPiece) return null;

  const renderShape = () => {
    return nextPiece.shape.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`
              w-4 h-4 border border-gray-600/30
              ${cell ? 
                `${TETROMINO_COLORS[nextPiece.type]} shadow-md border-white/20` : 
                'bg-transparent'
              }
            `}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl" />
      <h3 className="text-lg font-bold text-white mb-3 text-center">NEXT</h3>
      <div className="flex justify-center">
        <div className="inline-block">
          {renderShape()}
        </div>
      </div>
    </div>
  );
};