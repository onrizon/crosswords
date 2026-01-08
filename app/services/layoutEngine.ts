import { GRID_COLS, GRID_ROWS } from '../constants';
import { WordData } from '../types';

interface RawWord {
  word: string;
}

// Represents the grid state during generation
type GridChar = string | null;

export const generateLayout = (rawWords: RawWord[]): WordData[] => {
  // Sort by length descending to place big words first (anchors)
  const pool = [...rawWords].sort((a, b) => b.word.length - a.word.length);

  // Try multiple times to generate a valid layout if the first attempt gets stuck
  for (let attempt = 0; attempt < 50; attempt++) {
    const layout = attemptLayout(pool);
    // Increased requirement to try and fit more words if possible
    if (layout.length >= 20) {
      const result = layout.slice(0, 20).map((w, i) => ({ ...w, id: i + 1 }));
      return centerLayout(result);
    }
  }

  // If we really fail to place 20 words, return whatever max we found or fallback
  const bestEffort = attemptLayout(pool);
  // Cap at 20 words
  const result = bestEffort.slice(0, 20).map((w, i) => ({ ...w, id: i + 1 }));
  return centerLayout(result);
};

const attemptLayout = (pool: RawWord[]): WordData[] => {
  const grid: GridChar[][] = Array(GRID_ROWS)
    .fill(null)
    .map(() => Array(GRID_COLS).fill(null));
  const placedWords: WordData[] = [];

  // Place the first (longest) word horizontally in the center
  if (pool.length === 0) return [];

  const first = pool[0];
  const startRow = Math.floor(GRID_ROWS / 2);
  const startCol = Math.floor((GRID_COLS - first.word.length) / 2);

  if (placeWord(grid, first.word, startRow, startCol, 'H')) {
    placedWords.push({
      id: 0,
      word: first.word,
      direction: 'H',
      start: { row: startRow, col: startCol },
      isRevealed: false,
    });
  }

  // Try to place remaining words
  const remaining = pool.slice(1);

  // Shuffle remaining to randomize structure
  remaining.sort(() => Math.random() - 0.5);

  for (const candidate of remaining) {
    if (placedWords.length >= 20) break; // Limit increased to 20

    // Find all intersections with currently placed words
    const possiblePlacements: { r: number; c: number; dir: 'H' | 'V' }[] = [];

    for (let i = 0; i < candidate.word.length; i++) {
      const char = candidate.word[i];

      // Scan grid for this char
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          if (grid[r][c] === char) {
            // Found a matching letter. Can we place crosswise?

            // Try Horizontal
            if (canPlaceWord(grid, candidate.word, r, c - i, 'H')) {
              possiblePlacements.push({ r: r, c: c - i, dir: 'H' });
            }
            // Try Vertical
            if (canPlaceWord(grid, candidate.word, r - i, c, 'V')) {
              possiblePlacements.push({ r: r - i, c: c, dir: 'V' });
            }
          }
        }
      }
    }

    if (possiblePlacements.length > 0) {
      // Pick a random valid placement
      const pick =
        possiblePlacements[
          Math.floor(Math.random() * possiblePlacements.length)
        ];
      if (placeWord(grid, candidate.word, pick.r, pick.c, pick.dir)) {
        placedWords.push({
          id: 0, // id assigned later
          word: candidate.word,
          direction: pick.dir,
          start: { row: pick.r, col: pick.c },
          isRevealed: false,
        });
      }
    }
  }

  return placedWords;
};

const canPlaceWord = (
  grid: GridChar[][],
  word: string,
  row: number,
  col: number,
  dir: 'H' | 'V'
): boolean => {
  if (row < 0 || col < 0) return false;
  if (dir === 'H' && col + word.length > GRID_COLS) return false;
  if (dir === 'V' && row + word.length > GRID_ROWS) return false;

  // Check Immediate Borders (Start - 1) and (End + 1)
  if (dir === 'H') {
    if (col > 0 && grid[row][col - 1] !== null) return false; // Left block
    if (col + word.length < GRID_COLS && grid[row][col + word.length] !== null)
      return false; // Right block
  } else {
    if (row > 0 && grid[row - 1][col] !== null) return false; // Top block
    if (row + word.length < GRID_ROWS && grid[row + word.length][col] !== null)
      return false; // Bottom block
  }

  for (let i = 0; i < word.length; i++) {
    const r = dir === 'V' ? row + i : row;
    const c = dir === 'H' ? col + i : col;
    const char = word[i];
    const existing = grid[r][c];

    // Conflict check
    if (existing !== null && existing !== char) return false;

    // Adjacency Check (The Strict Scrabble Rule)
    if (existing === null) {
      if (dir === 'H') {
        // Check Top and Bottom neighbors
        if (r > 0 && grid[r - 1][c] !== null) return false;
        if (r < GRID_ROWS - 1 && grid[r + 1][c] !== null) return false;
      } else {
        // Check Left and Right neighbors
        if (c > 0 && grid[r][c - 1] !== null) return false;
        if (c < GRID_COLS - 1 && grid[r][c + 1] !== null) return false;
      }
    }
  }

  return true;
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

  // Calculate bounding box of all placed words
  let minRow = GRID_ROWS;
  let maxRow = 0;
  let minCol = GRID_COLS;
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

  // Calculate current dimensions and center offset
  const currentHeight = maxRow - minRow + 1;
  const currentWidth = maxCol - minCol + 1;

  const targetStartRow = Math.floor((GRID_ROWS - currentHeight) / 2);
  const targetStartCol = Math.floor((GRID_COLS - currentWidth) / 2);

  const rowOffset = targetStartRow - minRow;
  const colOffset = targetStartCol - minCol;

  // Apply offset to all words
  return words.map((word) => ({
    ...word,
    start: {
      row: word.start.row + rowOffset,
      col: word.start.col + colOffset,
    },
  }));
};
