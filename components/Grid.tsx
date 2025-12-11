import React, { useMemo } from 'react';
import { WordData, CellData } from '../types';
import { GRID_ROWS, GRID_COLS } from '../constants';
import { motion } from 'framer-motion';

interface GridProps {
  words: WordData[];
}

const Grid: React.FC<GridProps> = ({ words }) => {
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
        
        // Merge data if intersection
        grid[r][c] = {
          char: w.word[i],
          wordId: existing ? existing.wordId : w.id, // Keep primary existing or set new
          wordIds: existing ? [...existing.wordIds, w.id] : [w.id],
          isRevealed: w.isRevealed || (existing ? existing.isRevealed : false),
          row: r,
          col: c,
          isStartOfWord: existing?.isStartOfWord || isStart,
          clueNumber: (existing?.isStartOfWord || isStart) ? (existing?.clueNumber || w.id) : undefined
        };
      }
    });

    // Second pass to ensure if any word at an intersection is revealed, the cell is revealed
    words.forEach((w) => {
      if (w.isRevealed) {
        for (let i = 0; i < w.word.length; i++) {
          const r = w.direction === 'V' ? w.start.row + i : w.start.row;
          const c = w.direction === 'H' ? w.start.col + i : w.start.col;
          if (grid[r] && grid[r][c]) {
            grid[r][c]!.isRevealed = true;
          }
        }
      }
    });

    return grid;
  }, [words]);

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
              return <div key={`${rIndex}-${cIndex}`} className="w-9 h-9 md:w-11 md:h-11 lg:w-14 lg:h-14 rounded-md bg-white/[0.02]" />; // Subtle spacer
            }

            return (
              <div
                key={`${rIndex}-${cIndex}`}
                className={`
                  relative w-9 h-9 md:w-11 md:h-11 lg:w-14 lg:h-14 flex items-center justify-center
                  rounded-lg text-xl md:text-2xl lg:text-3xl font-black transition-all duration-500
                  ${cell.isRevealed 
                    ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 scale-105 border border-white/20' 
                    : 'bg-slate-800/60 border border-slate-700/50 text-transparent hover:bg-slate-700/60 hover:border-purple-500/30'}
                `}
              >
                {cell.isRevealed ? (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="drop-shadow-md"
                  >
                    {cell.char}
                  </motion.span>
                ) : (
                  <span className="opacity-0">{cell.char}</span>
                )}
                
                {/* Clue Number */}
                {cell.isStartOfWord && !cell.isRevealed && (
                  <span className="absolute top-0.5 left-1 text-[8px] md:text-[10px] lg:text-[11px] font-mono text-slate-500 font-bold">
                    {cell.clueNumber}
                  </span>
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