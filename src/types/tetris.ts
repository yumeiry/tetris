export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  shape: number[][];
  position: Position;
  type: TetrominoType;
}

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface GameState {
  board: (string | null)[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  paused: boolean;
}