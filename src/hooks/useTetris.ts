import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Tetromino, Position } from '../types/tetris';
import {
  initializeGame,
  isValidMove,
  placeTetromino,
  clearLines,
  calculateScore,
  getDropSpeed
} from '../utils/gameLogic';
import { getRandomTetromino, rotateTetromino } from '../utils/tetrominoes';

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame);
  const dropTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
    dropTimeRef.current = 0;
    lastTimeRef.current = 0;
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  }, []);

  const moveTetromino = useCallback((direction: 'left' | 'right' | 'down') => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      const delta = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
      const newPosition: Position = {
        x: prev.currentPiece.position.x + delta,
        y: direction === 'down' ? prev.currentPiece.position.y + 1 : prev.currentPiece.position.y
      };

      if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition
          }
        };
      }

      // If moving down and can't move, place the piece
      if (direction === 'down') {
        const newBoard = placeTetromino(prev.board, prev.currentPiece);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        const scoreGained = calculateScore(linesCleared, prev.level);
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10);

        const nextPiece = prev.nextPiece!;
        const newNextPiece = getRandomTetromino();

        // Check game over
        if (!isValidMove(clearedBoard, nextPiece, nextPiece.position)) {
          return {
            ...prev,
            board: clearedBoard,
            gameOver: true
          };
        }

        return {
          ...prev,
          board: clearedBoard,
          currentPiece: nextPiece,
          nextPiece: newNextPiece,
          score: prev.score + scoreGained,
          lines: newLines,
          level: newLevel
        };
      }

      return prev;
    });
  }, []);

  const rotatePiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      const rotatedPiece = rotateTetromino(prev.currentPiece);
      
      if (isValidMove(prev.board, rotatedPiece, rotatedPiece.position)) {
        return {
          ...prev,
          currentPiece: rotatedPiece
        };
      }

      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      let newY = prev.currentPiece.position.y;
      while (isValidMove(prev.board, prev.currentPiece, { 
        x: prev.currentPiece.position.x, 
        y: newY + 1 
      })) {
        newY++;
      }

      const droppedPiece = {
        ...prev.currentPiece,
        position: { x: prev.currentPiece.position.x, y: newY }
      };

      const newBoard = placeTetromino(prev.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const scoreGained = calculateScore(linesCleared, prev.level) + (newY - prev.currentPiece.position.y);
      const newLines = prev.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10);

      const nextPiece = prev.nextPiece!;
      const newNextPiece = getRandomTetromino();

      if (!isValidMove(clearedBoard, nextPiece, nextPiece.position)) {
        return {
          ...prev,
          board: clearedBoard,
          gameOver: true
        };
      }

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: nextPiece,
        nextPiece: newNextPiece,
        score: prev.score + scoreGained,
        lines: newLines,
        level: newLevel
      };
    });
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (!gameState.gameOver && !gameState.paused) {
      dropTimeRef.current += deltaTime;
      
      if (dropTimeRef.current > getDropSpeed(gameState.level)) {
        moveTetromino('down');
        dropTimeRef.current = 0;
      }
    }
  }, [gameState.gameOver, gameState.paused, gameState.level, moveTetromino]);

  useEffect(() => {
    let animationId: number;
    
    const animate = (time: number) => {
      gameLoop(time);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameLoop]);

  return {
    gameState,
    moveTetromino,
    rotatePiece,
    hardDrop,
    resetGame,
    togglePause
  };
};