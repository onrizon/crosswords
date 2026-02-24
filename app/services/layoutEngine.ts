import * as C from '@/constants';
import { WordData } from '../types/types';

// Represents the grid state during generation
type GridChar = string | null;

interface Placement {
  row: number;
  col: number;
  dir: 'H' | 'V';
  intersections: number; // Number of letter intersections with existing words
}

const MAX_WORDS = 40;

export const generateLayout = (rawWords: string[]): WordData[] => {
  // Sort by length descending - longer words are better anchors
  const pool = [...rawWords].sort((a, b) => b.length - a.length);

  let bestLayout: WordData[] = [];

  // Try multiple times and keep the best result
  for (let attempt = 0; attempt < 100; attempt++) {
    const layout = attemptLayout(pool, attempt);

    // Keep track of the best layout found
    if (layout.length > bestLayout.length) {
      bestLayout = layout;
    }

    // If we reached our target, we're done
    if (bestLayout.length >= MAX_WORDS) {
      break;
    }
  }

  // Cap at MAX_WORDS and assign IDs
  const result = bestLayout.slice(0, MAX_WORDS).map((w, i) => ({ ...w, id: i + 1 }));
  return centerLayout(result);
};

const attemptLayout = (pool: string[], attemptNum: number): WordData[] => {
  const grid: GridChar[][] = Array(C.GRID_ROWS)
    .fill(null)
    .map(() => Array(C.GRID_COLS).fill(null));
  const placedWords: WordData[] = [];
  const unplacedWords: string[] = [];

  if (pool.length === 0) return [];

  // Place the first (longest) word horizontally in the center
  const first = pool[0];
  const startRow = Math.floor(C.GRID_ROWS / 2);
  const startCol = Math.floor((C.GRID_COLS - first.length) / 2);

  if (placeWord(grid, first, startRow, startCol, 'H')) {
    placedWords.push({
      id: 0,
      word: first,
      direction: 'H',
      start: { row: startRow, col: startCol },
      isRevealed: false,
    });
  }

  // Prepare remaining words with slight randomization but keeping longer words earlier
  const remaining = pool.slice(1);

  // Group words by length ranges and shuffle within groups for variety
  const shuffled = shuffleByLengthGroups(remaining, attemptNum);

  // First pass: try to place all words
  for (const candidate of shuffled) {
    if (placedWords.length >= MAX_WORDS) break;

    const placed = tryPlaceWord(grid, candidate, placedWords);
    if (!placed) {
      unplacedWords.push(candidate);
    }
  }

  // Multiple additional passes: retry unplaced words as grid fills up
  // More letters on grid = more intersection opportunities
  for (let pass = 0; pass < 5 && unplacedWords.length > 0; pass++) {
    const stillUnplaced: string[] = [];

    for (const candidate of unplacedWords) {
      if (placedWords.length >= MAX_WORDS) break;

      const placed = tryPlaceWord(grid, candidate, placedWords);
      if (!placed) {
        stillUnplaced.push(candidate);
      }
    }

    unplacedWords.length = 0;
    unplacedWords.push(...stillUnplaced);

    // If no progress was made in this pass, stop retrying
    if (stillUnplaced.length === unplacedWords.length) break;
  }

  return placedWords;
};

// Shuffle words while keeping longer words generally earlier
const shuffleByLengthGroups = (words: string[], seed: number): string[] => {
  // Group by length ranges: 10-8, 7-6, 5-4, 3
  const groups: string[][] = [[], [], [], []];

  for (const word of words) {
    if (word.length >= 8) groups[0].push(word);
    else if (word.length >= 6) groups[1].push(word);
    else if (word.length >= 4) groups[2].push(word);
    else groups[3].push(word);
  }

  // Shuffle each group
  for (const group of groups) {
    shuffleArray(group, seed);
  }

  return groups.flat();
};

const shuffleArray = (arr: string[], seed: number): void => {
  // Simple seeded shuffle for variety between attempts
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor((Math.random() + seed * 0.0001) * (i + 1)) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const tryPlaceWord = (
  grid: GridChar[][],
  candidate: string,
  placedWords: WordData[]
): boolean => {
  // Find all valid placements for this word
  const placements = findAllPlacements(grid, candidate);

  if (placements.length === 0) return false;

  // Sort placements by number of intersections (more is better)
  // This creates denser, more connected crosswords
  placements.sort((a, b) => b.intersections - a.intersections);

  // Pick from top placements with some randomness for variety
  const topCount = Math.min(3, placements.length);
  const pick = placements[Math.floor(Math.random() * topCount)];

  if (placeWord(grid, candidate, pick.row, pick.col, pick.dir)) {
    placedWords.push({
      id: 0,
      word: candidate,
      direction: pick.dir,
      start: { row: pick.row, col: pick.col },
      isRevealed: false,
    });
    return true;
  }

  return false;
};

const findAllPlacements = (grid: GridChar[][], word: string): Placement[] => {
  const placements: Placement[] = [];

  // For each letter in the word, find matching letters on the grid
  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    for (let r = 0; r < C.GRID_ROWS; r++) {
      for (let c = 0; c < C.GRID_COLS; c++) {
        if (grid[r][c] === char) {
          // Try horizontal placement (word crosses this point at position i)
          const hCol = c - i;
          if (canPlaceWord(grid, word, r, hCol, 'H')) {
            const intersections = countIntersections(grid, word, r, hCol, 'H');
            placements.push({ row: r, col: hCol, dir: 'H', intersections });
          }

          // Try vertical placement
          const vRow = r - i;
          if (canPlaceWord(grid, word, vRow, c, 'V')) {
            const intersections = countIntersections(grid, word, vRow, c, 'V');
            placements.push({ row: vRow, col: c, dir: 'V', intersections });
          }
        }
      }
    }
  }

  return placements;
};

const countIntersections = (
  grid: GridChar[][],
  word: string,
  row: number,
  col: number,
  dir: 'H' | 'V'
): number => {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const r = dir === 'V' ? row + i : row;
    const c = dir === 'H' ? col + i : col;
    if (grid[r][c] === word[i]) {
      count++;
    }
  }
  return count;
};

const canPlaceWord = (
  grid: GridChar[][],
  word: string,
  row: number,
  col: number,
  dir: 'H' | 'V'
): boolean => {
  if (row < 0 || col < 0) return false;
  if (dir === 'H' && col + word.length > C.GRID_COLS) return false;
  if (dir === 'V' && row + word.length > C.GRID_ROWS) return false;

  // Must have at least one intersection with existing letters
  let hasIntersection = false;

  // Check immediate borders (before start and after end)
  if (dir === 'H') {
    if (col > 0 && grid[row][col - 1] !== null) return false;
    if (col + word.length < C.GRID_COLS && grid[row][col + word.length] !== null)
      return false;
  } else {
    if (row > 0 && grid[row - 1][col] !== null) return false;
    if (row + word.length < C.GRID_ROWS && grid[row + word.length][col] !== null)
      return false;
  }

  for (let i = 0; i < word.length; i++) {
    const r = dir === 'V' ? row + i : row;
    const c = dir === 'H' ? col + i : col;
    const char = word[i];
    const existing = grid[r][c];

    // Conflict check - different letter already there
    if (existing !== null && existing !== char) return false;

    // Track if we have at least one intersection
    if (existing === char) {
      hasIntersection = true;
    }

    // Adjacency check - no parallel words allowed (Scrabble rule)
    if (existing === null) {
      if (dir === 'H') {
        if (r > 0 && grid[r - 1][c] !== null) return false;
        if (r < C.GRID_ROWS - 1 && grid[r + 1][c] !== null) return false;
      } else {
        if (c > 0 && grid[r][c - 1] !== null) return false;
        if (c < C.GRID_COLS - 1 && grid[r][c + 1] !== null) return false;
      }
    }
  }

  // Word must intersect with at least one existing letter (except first word)
  return hasIntersection;
};

const placeWord = (
  grid: GridChar[][],
  word: string,
  row: number,
  col: number,
  dir: 'H' | 'V'
): boolean => {
  for (let i = 0; i < word.length; i++) {
    const r = dir === 'V' ? row + i : row;
    const c = dir === 'H' ? col + i : col;
    grid[r][c] = word[i];
  }
  return true;
};

const centerLayout = (words: WordData[]): WordData[] => {
  if (words.length === 0) return words;

  // Calculate bounding box
  let minRow = C.GRID_ROWS;
  let maxRow = 0;
  let minCol = C.GRID_COLS;
  let maxCol = 0;

  for (const word of words) {
    const { row, col } = word.start;
    const endRow = word.direction === 'V' ? row + word.word.length - 1 : row;
    const endCol = word.direction === 'H' ? col + word.word.length - 1 : col;

    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, endRow);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, endCol);
  }

  const currentHeight = maxRow - minRow + 1;
  const currentWidth = maxCol - minCol + 1;

  const targetStartRow = Math.ceil((C.GRID_ROWS - currentHeight) / 2);
  const targetStartCol = Math.ceil((C.GRID_COLS - currentWidth) / 2);

  const rowOffset = targetStartRow - minRow;
  const colOffset = targetStartCol - minCol;

  return words.map((word) => ({
    ...word,
    start: {
      row: word.start.row + rowOffset,
      col: word.start.col + colOffset,
    },
  }));
};
