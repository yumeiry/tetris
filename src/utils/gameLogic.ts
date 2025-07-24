import { GameState, Tetromino, Position } from '../types/tetris';
import { getRandomTetromino } from './tetrominoes';

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

export const initializeGame = (): GameState => ({
  board: createEmptyBoard(),
  currentPiece: getRandomTetromino(),
  nextPiece: getRandomTetromino(),
  score: 0,
  level: 0,
  lines: 0,
  gameOver: false,
  paused: false
});