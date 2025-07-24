import { GameState, Tetromino, Position } from '../types/tetris';
import { getRandomTetromino, TETROMINO_SHAPES } from './tetrominoes';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const createEmptyBoard = (): (string | null)[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

export const isValidMove = (
  board: (string | null)[][],
  tetromino: Tetromino,
  newPosition: Position
): boolean => {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = newPosition.x + x;
        const newY = newPosition.y + y;

        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placeTetromino = (
  board: (string | null)[][],
  tetromino: Tetromino
): (string | null)[][] => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const boardY = tetromino.position.y + y;
        const boardX = tetromino.position.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = tetromino.type;
        }
      }
    }
  }
  
  return newBoard;
};

export const clearLines = (board: (string | null)[][]): {
  newBoard: (string | null)[][];
  linesCleared: number;
} => {
  const linesToClear: number[] = [];
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== null)) {
      linesToClear.push(y);
    }
  }
  
  if (linesToClear.length === 0) {
    return { newBoard: board, linesCleared: 0 };
  }
  
  const newBoard = board.filter((_, index) => !linesToClear.includes(index));
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { newBoard, linesCleared: linesToClear.length };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScore = [0, 40, 100, 300, 1200];
  return baseScore[linesCleared] * (level + 1);
};

export const getDropSpeed = (level: number): number => {
  return Math.max(50, 1000 - (level * 50));
};

export const checkTSpin = (
  board: (string | null)[][],
  tetromino: Tetromino,
  wasRotated: boolean
): { isTSpin: boolean; isMinimal: boolean } => {
  if (tetromino.type !== 'T' || !wasRotated) {
    return { isTSpin: false, isMinimal: false };
  }

  const { position } = tetromino;
  const corners = [
    { x: position.x, y: position.y }, // Top-left
    { x: position.x + 2, y: position.y }, // Top-right
    { x: position.x, y: position.y + 2 }, // Bottom-left
    { x: position.x + 2, y: position.y + 2 } // Bottom-right
  ];

  let filledCorners = 0;
  let frontCorners = 0;

  // Check which corners are filled
  corners.forEach((corner, index) => {
    const isOutOfBounds = corner.x < 0 || corner.x >= BOARD_WIDTH || corner.y >= BOARD_HEIGHT;
    const isFilled = isOutOfBounds || (corner.y >= 0 && board[corner.y][corner.x]);
    
    if (isFilled) {
      filledCorners++;
      // Front corners are determined by T-piece orientation
      if (index < 2) frontCorners++; // Top corners for most orientations
    }
  });

  const isTSpin = filledCorners >= 3;
  const isMinimal = isTSpin && frontCorners < 2;

  return { isTSpin, isMinimal };
};

export const calculateTSpinScore = (
  linesCleared: number,
  level: number,
  isTSpin: boolean,
  isMinimal: boolean
): number => {
  if (!isTSpin) {
    return calculateScore(linesCleared, level);
  }

  const tSpinScores = isMinimal 
    ? [0, 100, 200, 400, 800] // T-Spin Mini scores
    : [0, 800, 1200, 1600, 2000]; // T-Spin scores

  return tSpinScores[linesCleared] * (level + 1);
};

export const initializeGame = (): GameState => ({
  board: createEmptyBoard(),
  currentPiece: getRandomTetromino(),
  nextPiece: getRandomTetromino(),
  holdPiece: null,
  canHold: true,
  score: 0,
  level: 0,
  lines: 0,
  gameOver: false,
  paused: false
});