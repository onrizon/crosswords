import React, { useMemo } from 'react';
import { WordData, CellData } from '../types';
import { GRID_ROWS, GRID_COLS } from '../constants';
import { motion } from 'framer-motion';

interface GridProps {
  words: WordData[];
  revealedHints: Set<string>; // Set of "row,col" strings
}

const Grid: React.FC<GridProps> = ({ words, revealedHints }) => {
  // Compute the grid cells based on words
  const cells = useMemo(() => {
    const grid: (CellData | null)[][] = Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(null));

    words.forEach((w) => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'V' ? w.start.row + i : w.start.row;
        const c = w.direction === 'H' ? w.start.col + i : w.start.col;

        if (r >= GRID_ROWS || c >= GRID_COLS) continue;

        const existing = grid[r][c];
        const isStart = i === 0;
        
        // Check if this specific cell is revealed via hint
        const isHintRevealed = revealedHints.has(`${r},${c}`);

        // Merge data if intersection
        grid[r][c] = {
          char: w.word[i],
          wordId: existing ? existing.wordId : w.id, // Keep primary existing or set new
          wordIds: existing ? [...existing.wordIds, w.id] : [w.id],
          // Cell is revealed if the word is revealed, OR if it was previously revealed (intersection), OR if it is a hint
          isRevealed: w.isRevealed || (existing ? existing.isRevealed : false) || isHintRevealed,
          row: r,
          col: c,
          isStartOfWord: existing?.isStartOfWord || isStart,
          clueNumber: (existing?.isStartOfWord || isStart) ? (existing?.clueNumber || w.id) : undefined
        };
      }
    });

    // Second pass: Ensure animation delays are set correctly
    // If a word is revealed, we cascade. If it's just a hint, we pop it immediately.
    words.forEach((w) => {
      if (w.isRevealed) {
        for (let i = 0; i < w.word.length; i++) {
          const r = w.direction === 'V' ? w.start.row + i : w.start.row;
          const c = w.direction === 'H' ? w.start.col + i : w.start.col;
          if (grid[r] && grid[r][c]) {
            grid[r][c]!.isRevealed = true;
            // Only set cascade delay if it wasn't already revealed by a hint
            if (!grid[r][c]!.delay) {
               grid[r][c]!.delay = i * 0.1; 
            }
          }
        }
      }
    });

    return grid;
  }, [words, revealedHints]);

  return (
    <div className="relative p-6 select-none bg-slate-900/50 rounded-xl border border-white/5 shadow-2xl backdrop-blur-sm">
      <div 
        className="grid gap-1.5"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          width: 'fit-content',
          margin: '0 auto'
        }}
      >
        {cells.map((row, rIndex) => (
          row.map((cell, cIndex) => {
            if (!cell) {
              return <div key={`${rIndex}-${cIndex}`} className="w-12 h-12 rounded-md bg-white/[0.02]" />; // Subtle spacer
            }

            return (
              <div
                key={`${rIndex}-${cIndex}`}
                className="relative w-12 h-12"
              >
                {cell.isRevealed ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 1 }}
                    transition={{ 
                      delay: cell.delay || 0,
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25 
                    }}
                    className={`
                      absolute inset-0 flex items-center justify-center rounded-lg text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 border border-white/20
                      ${revealedHints.has(`${cell.row},${cell.col}`) && !cell.wordIds.some(id => words.find(w => w.id === id)?.isRevealed) 
                        ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500' // Different color for hints not yet fully solved
                        : 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600'}
                    `}
                  >
                    <span className="text-3xl font-black drop-shadow-md">
                      {cell.char}
                    </span>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 hover:border-purple-500/30 transition-colors">
                     {/* Clue Number */}
                     {cell.isStartOfWord && (
                        <span className="absolute top-0.5 left-1 text-[11px] font-mono text-slate-500 font-bold">
                          {cell.clueNumber}
                        </span>
                     )}
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Grid;