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
  // wordId: number; // The primary word this cell belongs to (for coloring/logic)
  words: { id: number; start: boolean; direction: 'H' | 'V' }[]; // All words this cell belongs to (intersections)
  isRevealed: boolean;
  row: number;
  col: number;
  delay?: number; // Animation delay in seconds
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

// Raw AI response (words without positions)
export interface RawLevel {
  theme: string;
  words: string[];
}

// API response (words with positions)
export interface Level {
  theme: string;
  words: WordData[];
}
