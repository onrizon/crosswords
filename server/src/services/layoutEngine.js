import { GRID_ROWS, GRID_COLS } from '../util/constants.js';

const MAX_WORDS = 40;

export function generateLayout(rawWords) {
  const pool = [...rawWords].sort((a, b) => b.length - a.length);

  let bestLayout = [];

  for (let attempt = 0; attempt < 100; attempt++) {
    const layout = attemptLayout(pool, attempt);

    if (layout.length > bestLayout.length) {
      bestLayout = layout;
    }

    if (bestLayout.length >= MAX_WORDS) {
      break;
    }
  }

  const result = bestLayout.slice(0, MAX_WORDS).map((w, i) => ({ ...w, id: i + 1 }));
  return centerLayout(result);
}

function attemptLayout(pool, attemptNum) {
  const grid = Array(GRID_ROWS)
    .fill(null)
    .map(() => Array(GRID_COLS).fill(null));
  const placedWords = [];
  const unplacedWords = [];

  if (pool.length === 0) return [];

  const first = pool[0];
  const startRow = Math.floor(GRID_ROWS / 2);
  const startCol = Math.floor((GRID_COLS - first.length) / 2);

  if (placeWord(grid, first, startRow, startCol, 'H')) {
    placedWords.push({
      id: 0,
      word: first,
      direction: 'H',
      start: { row: startRow, col: startCol },
      isRevealed: false,
    });
  }

  const remaining = pool.slice(1);
  const shuffled = shuffleByLengthGroups(remaining, attemptNum);

  for (const candidate of shuffled) {
    if (placedWords.length >= MAX_WORDS) break;

    const placed = tryPlaceWord(grid, candidate, placedWords);
    if (!placed) {
      unplacedWords.push(candidate);
    }
  }

  for (let pass = 0; pass < 5 && unplacedWords.length > 0; pass++) {
    const stillUnplaced = [];

    for (const candidate of unplacedWords) {
      if (placedWords.length >= MAX_WORDS) break;

      const placed = tryPlaceWord(grid, candidate, placedWords);
      if (!placed) {
        stillUnplaced.push(candidate);
      }
    }

    unplacedWords.length = 0;
    unplacedWords.push(...stillUnplaced);

    if (stillUnplaced.length === unplacedWords.length) break;
  }

  return placedWords;
}

function shuffleByLengthGroups(words, seed) {
  const groups = [[], [], [], []];

  for (const word of words) {
    if (word.length >= 8) groups[0].push(word);
    else if (word.length >= 6) groups[1].push(word);
    else if (word.length >= 4) groups[2].push(word);
    else groups[3].push(word);
  }

  for (const group of groups) {
    shuffleArray(group, seed);
  }

  return groups.flat();
}

function shuffleArray(arr, seed) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor((Math.random() + seed * 0.0001) * (i + 1)) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function tryPlaceWord(grid, candidate, placedWords) {
  const placements = findAllPlacements(grid, candidate);

  if (placements.length === 0) return false;

  placements.sort((a, b) => b.intersections - a.intersections);

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
}

function findAllPlacements(grid, word) {
  const placements = [];

  for (let i = 0; i < word.length; i++) {
    const char = word[i];

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (grid[r][c] === char) {
          const hCol = c - i;
          if (canPlaceWord(grid, word, r, hCol, 'H')) {
            const intersections = countIntersections(grid, word, r, hCol, 'H');
            placements.push({ row: r, col: hCol, dir: 'H', intersections });
          }

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
}

function countIntersections(grid, word, row, col, dir) {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const r = dir === 'V' ? row + i : row;
    const c = dir === 'H' ? col + i : col;
    if (grid[r][c] === word[i]) {
      count++;
    }
  }
  return count;
}

function canPlaceWord(grid, word, row, col, dir) {
  if (row < 0 || col < 0) return false;
  if (dir === 'H' && col + word.length > GRID_COLS) return false;
  if (dir === 'V' && row + word.length > GRID_ROWS) return false;

  let hasIntersection = false;

  if (dir === 'H') {
    if (col > 0 && grid[row][col - 1] !== null) return false;
    if (col + word.length < GRID_COLS && grid[row][col + word.length] !== null) return false;
  } else {
    if (row > 0 && grid[row - 1][col] !== null) return false;
    if (row + word.length < GRID_ROWS && grid[row + word.length][col] !== null) return false;
  }

  for (let i = 0; i < word.length; i++) {
    const r = dir === 'V' ? row + i : row;
    const c = dir === 'H' ? col + i : col;
    const char = word[i];
    const existing = grid[r][c];

    if (existing !== null && existing !== char) return false;

    if (existing === char) {
      hasIntersection = true;
    }

    if (existing === null) {
      if (dir === 'H') {
        if (r > 0 && grid[r - 1][c] !== null) return false;
        if (r < GRID_ROWS - 1 && grid[r + 1][c] !== null) return false;
      } else {
        if (c > 0 && grid[r][c - 1] !== null) return false;
        if (c < GRID_COLS - 1 && grid[r][c + 1] !== null) return false;
      }
    }
  }

  return hasIntersection;
}

function placeWord(grid, word, row, col, dir) {
  for (let i = 0; i < word.length; i++) {
    const r = dir === 'V' ? row + i : row;
    const c = dir === 'H' ? col + i : col;
    grid[r][c] = word[i];
  }
  return true;
}

function centerLayout(words) {
  if (words.length === 0) return words;

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

  const currentHeight = maxRow - minRow + 1;
  const currentWidth = maxCol - minCol + 1;

  const targetStartRow = Math.ceil((GRID_ROWS - currentHeight) / 2);
  const targetStartCol = Math.ceil((GRID_COLS - currentWidth) / 2);

  const rowOffset = targetStartRow - minRow;
  const colOffset = targetStartCol - minCol;

  return words.map((word) => ({
    ...word,
    start: {
      row: word.start.row + rowOffset,
      col: word.start.col + colOffset,
    },
  }));
}
