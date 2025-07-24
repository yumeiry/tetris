import React from 'react';
import { GameState } from '../types/tetris';

interface GameInfoProps {
  gameState: GameState;
}

export const GameInfo: React.FC<GameInfoProps> = ({ gameState }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 shadow-xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-yellow-500/10 rounded-xl" />
        <div className="relative">
          <h3 className="text-lg font-bold text-white mb-2">SCORE</h3>
          <p className="text-2xl font-mono text-green-400">{gameState.score.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-gray-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 shadow-xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl" />
        <div className="relative">
          <h3 className="text-lg font-bold text-white mb-2">LEVEL</h3>
          <p className="text-2xl font-mono text-blue-400">{gameState.level}</p>
        </div>
      </div>
      
      <div className="bg-gray-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 shadow-xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl" />
        <div className="relative">
          <h3 className="text-lg font-bold text-white mb-2">LINES</h3>
          <p className="text-2xl font-mono text-purple-400">{gameState.lines}</p>
        </div>
      </div>
    </div>
  );
};