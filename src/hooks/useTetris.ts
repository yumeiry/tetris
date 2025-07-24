import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Tetromino, Position } from '../types/tetris';
import {
  initializeGame,
  isValidMove,
  placeTetromino,
  clearLines,
  calculateScore,
  getDropSpeed,
  checkTSpin,
  calculateTSpinScore
} from '../utils/gameLogic';
import { getRandomTetromino, rotateTetromino } from '../utils/tetrominoes';

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame);
  const [lastRotated, setLastRotated] = useState<boolean>(false);
  const dropTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    setGameState(initializeGame());
    setLastRotated(false);
    dropTimeRef.current = 0;
    lastTimeRef.current = 0;
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  }, []);

  const holdPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused || !prev.canHold) return prev;

      if (prev.holdPiece === null) {
        // First time holding
        const newNextPiece = getRandomTetromino();
        return {
          ...prev,
          holdPiece: { ...prev.currentPiece, position: { x: 3, y: 0 } },
          currentPiece: prev.nextPiece,
          nextPiece: newNextPiece,
          canHold: false
        };
      } else {
        // Swap current and hold pieces
        const newHoldPiece = { ...prev.currentPiece, position: { x: 3, y: 0 } };
        const newCurrentPiece = { ...prev.holdPiece, position: { x: 3, y: 0 } };
        
        return {
          ...prev,
          holdPiece: newHoldPiece,
          currentPiece: newCurrentPiece,
          canHold: false
        };
      }
    });
  }, []);
  const moveTetromino = useCallback((direction: 'left' | 'right' | 'down') => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      setLastRotated(false);

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
        const tSpinResult = checkTSpin(prev.board, prev.currentPiece, lastRotated);
        const newBoard = placeTetromino(prev.board, prev.currentPiece);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        const scoreGained = calculateTSpinScore(linesCleared, prev.level, tSpinResult.isTSpin, tSpinResult.isMinimal);
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
          canHold: true,
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
        setLastRotated(true);
        return {
          ...prev,
          currentPiece: rotatedPiece
        };
      }

      // Try wall kicks for T-piece
      if (prev.currentPiece.type === 'T') {
        const wallKicks = [
          { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 },
          { x: -1, y: -1 }, { x: 1, y: -1 }
        ];

        for (const kick of wallKicks) {
          const kickedPosition = {
            x: rotatedPiece.position.x + kick.x,
            y: rotatedPiece.position.y + kick.y
          };
          
          if (isValidMove(prev.board, rotatedPiece, kickedPosition)) {
            setLastRotated(true);
            return {
              ...prev,
              currentPiece: {
                ...rotatedPiece,
                position: kickedPosition
              }
            };
          }
        }
      }
      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.paused) return prev;

      setLastRotated(false);

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

      const tSpinResult = checkTSpin(prev.board, droppedPiece, lastRotated);
      const newBoard = placeTetromino(prev.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const baseScore = calculateTSpinScore(linesCleared, prev.level, tSpinResult.isTSpin, tSpinResult.isMinimal);
      const scoreGained = baseScore + (newY - prev.currentPiece.position.y);
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
        canHold: true,
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
    holdPiece,
    resetGame,
    togglePause
  };
};