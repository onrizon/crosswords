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
  revealedCount: number;
  row: number;
  col: number;
  delay?: number; // Animation delay in seconds
}

export type UserScores = Record<string, { round: number; total: number }>;

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

// Player in a room
export interface Player {
  id: string;
  name: string;
  provider?: string | null;
  roundScore: number;
  totalScore: number;
}

// Room state from server
export interface RoomState {
  code: string;
  ownerId: string;
  ownerName: string;
  authMode: 'anonymous' | 'twitch' | 'discord';
  language: string;
  duration: number;
  endMode: number;
  endTarget: number;
  status: number;
  players: Player[];
  currentTheme: string;
  words: WordData[];
  timeLeft: number;
  isLoading: boolean;
  isPaused: boolean;
  roundNumber: number;
  lastHit: { username: string; word: string; index: number } | null;
  playerScores: UserScores;
}

export interface GuessResult {
  hit: boolean;
  word?: string | null;
  index?: number | null;
}
