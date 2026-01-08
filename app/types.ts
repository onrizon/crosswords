export interface Coordinate {
  row: number;
  col: number;
}

export interface WordData {
  id: number;
  word: string; // The answer
  direction: 'H' | 'V';
  start: Coordinate;
  isRevealed: boolean;
  revealedBy?: string; // Username of the guesser
}

export interface CellData {
  char: string;
  wordId: number; // The primary word this cell belongs to (for coloring/logic)
  wordIds: number[]; // All words this cell belongs to (intersections)
  isRevealed: boolean;
  row: number;
  col: number;
  isStartOfWord?: boolean;
  delay?: number; // Animation delay in seconds
  startWordId?: number; // ID of the word that starts at this cell
  startWordDirection?: 'H' | 'V'; // Direction of the word that starts at this cell
}

export interface GameState {
  status: 'connecting' | 'connected' | 'error';
  words: WordData[];
  score: number;
  latestWinner: string | null;
}

export type UserScores = Record<string, { round: number; total: number }>;

export type LevelKey =
  | 'ESCRITORIO'
  | 'ESCOLA'
  | 'NATAL'
  | 'QUADRINHOS'
  | 'ANIMAIS'
  | 'CHURRASCO'
  | 'FIM_DE_ANO'
  | 'FANTASIAS'
  | 'PAISES'
  | 'COMIDAS'
  | 'NOMES';

export interface LevelData {
  key: LevelKey;
  words: WordData[];
}

export interface Level {
  theme: string;
  words: string[];
}
