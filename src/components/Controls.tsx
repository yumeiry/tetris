import React from 'react';
import { RotateCcw, Pause, Play, RotateCw, ArrowDown, Package } from 'lucide-react';

interface ControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ isPaused, onTogglePause, onRestart }) => {
  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 shadow-xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl" />
      <div className="relative">
        <h3 className="text-lg font-bold text-white mb-4 text-center">CONTROLS</h3>
        
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center justify-between">
            <span>Move Left/Right</span>
            <span className="text-cyan-400">← →</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Soft Drop</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <ArrowDown size={14} /> ↓
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hard Drop</span>
            <span className="text-cyan-400">SPACE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Rotate</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <RotateCw size={14} /> ↑
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hold</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Package size={14} /> C
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Pause</span>
            <span className="text-cyan-400">P</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Restart</span>
            <span className="text-cyan-400">R</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={onTogglePause}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'PLAY' : 'PAUSE'}
          </button>
          <button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            RESTART
          </button>
        </div>
      </div>
    </div>
  );
};