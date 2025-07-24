import React from 'react';
import { Tetromino } from '../types/tetris';
import { TETROMINO_COLORS } from '../utils/tetrominoes';

interface HoldPieceProps {
  holdPiece: Tetromino | null;
  canHold: boolean;
}

export const HoldPiece: React.FC<HoldPieceProps> = ({ holdPiece, canHold }) => {
  const renderShape = () => {
    if (!holdPiece) {
      return (
        <div className="flex justify-center items-center h-16">
          <span className="text-gray-500 text-sm">Empty</span>
        </div>
      );
    }

    return holdPiece.shape.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`
              w-4 h-4 border border-gray-600/30 transition-all duration-200
              ${cell ? 
                `${TETROMINO_COLORS[holdPiece.type]} shadow-md border-white/20 ${!canHold ? 'opacity-50' : ''}` : 
                'bg-transparent'
              }
            `}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 shadow-xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl" />
      <div className="relative">
        <h3 className="text-lg font-bold text-white mb-3 text-center">HOLD</h3>
        <div className="flex justify-center">
          <div className="inline-block">
            {renderShape()}
          </div>
        </div>
        {!canHold && (
          <div className="text-center mt-2">
            <span className="text-xs text-red-400">Used</span>
          </div>
        )}
      </div>
    </div>
  );
};