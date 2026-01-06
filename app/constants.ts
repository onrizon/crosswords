import { WordData } from './types';

// Changed to a wider aspect ratio (approx 2:1) to fit desktop screens better
// Increased to 14x26 as requested
export const GRID_ROWS = 14;
export const GRID_COLS = 26;

// Fallback data in case API fails or for initial render before fetch
export const FALLBACK_WORDS: WordData[] = [
  {
    id: 1,
    word: 'TECLADO',
    direction: 'H',
    start: { row: 6, col: 8 },
    isRevealed: false,
  },
  {
    id: 2,
    word: 'CADEIRA',
    direction: 'V',
    start: { row: 3, col: 9 },
    isRevealed: false,
  },
  {
    id: 3,
    word: 'DADOS',
    direction: 'V',
    start: { row: 6, col: 13 },
    isRevealed: false,
  },
  {
    id: 4,
    word: 'REDE',
    direction: 'H',
    start: { row: 8, col: 9 },
    isRevealed: false,
  },
  {
    id: 5,
    word: 'MODEM',
    direction: 'H',
    start: { row: 9, col: 12 },
    isRevealed: false,
  },
  {
    id: 6,
    word: 'EMAIL',
    direction: 'V',
    start: { row: 8, col: 15 },
    isRevealed: false,
  },
  {
    id: 7,
    word: 'PASTA',
    direction: 'V',
    start: { row: 5, col: 11 },
    isRevealed: false,
  },
  {
    id: 8,
    word: 'CAFE',
    direction: 'H',
    start: { row: 3, col: 9 },
    isRevealed: false,
  },
];
