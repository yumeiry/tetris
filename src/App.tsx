import React, { useEffect } from 'react';
import { useTetris } from './hooks/useTetris';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { GameInfo } from './components/GameInfo';
import { Controls } from './components/Controls';

function App() {
  const { gameState, moveTetromino, rotatePiece, hardDrop, resetGame, togglePause } = useTetris();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameOver) {
        if (event.code === 'KeyR') {
          resetGame();
        }
        return;
      }

      switch (event.code) {
        case 'ArrowLeft':
          event.preventDefault();
          moveTetromino('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          moveTetromino('right');
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveTetromino('down');
          break;
        case 'ArrowUp':
          event.preventDefault();
          rotatePiece();
          break;
        case 'Space':
          event.preventDefault();
          hardDrop();
          break;
        case 'KeyP':
          event.preventDefault();
          togglePause();
          break;
        case 'KeyR':
          event.preventDefault();
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, moveTetromino, rotatePiece, hardDrop, resetGame, togglePause]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          TETRIS
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-4">
            <NextPiece nextPiece={gameState.nextPiece} />
            <GameInfo gameState={gameState} />
          </div>
          
          {/* Game Board */}
          <div className="lg:col-span-2 flex justify-center">
            <GameBoard gameState={gameState} />
          </div>
          
          {/* Right Panel */}
          <div className="lg:col-span-1">
            <Controls 
              isPaused={gameState.paused}
              onTogglePause={togglePause}
              onRestart={resetGame}
            />
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-400">
          <p className="text-sm">Use arrow keys to move and rotate pieces</p>
          <p className="text-xs mt-1">Press SPACE for hard drop, P to pause, R to restart</p>
        </div>
      </div>
    </div>
  );
}

export default App;