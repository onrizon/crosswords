import styles from '@/styles/Grid.module.css';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { GRID_COLS, GRID_ROWS } from '../constants';
import { CellData, WordData } from '../types';

import classNames from 'classnames';
import { Asap_Condensed } from 'next/font/google';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

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

        // Check if this specific cell is revealed via hint

        // Merge data if intersection
        grid[r][c] = {
          char: w.word[i],
          wordId: existing ? existing.wordId : w.id, // Keep primary existing or set new
          wordIds: existing ? [...existing.wordIds, w.id] : [w.id],
          // Cell is revealed if the word is revealed, OR if it was previously revealed (intersection), OR if it is a hint
          isRevealed: w.isRevealed || (existing ? existing.isRevealed : false),
          row: r,
          col: c,
          isStartOfWord: existing?.isStartOfWord || isStart,
          startWordId: existing?.startWordId || (isStart ? w.id : undefined),
          startWordDirection:
            existing?.startWordDirection || (isStart ? w.direction : undefined),
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
  }, [words]);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.container}
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          width: 'fit-content',
          margin: '0 auto',
        }}
      >
        {cells.map((row, rIndex) =>
          row.map((cell, cIndex) => {
            if (!cell) {
              return (
                <div key={`${rIndex}-${cIndex}`} className={styles.cellEmpty} />
              ); // Subtle spacer
            }

            const isHintOnly = !cell.wordIds.some(
              (id) => words.find((w) => w.id === id)?.isRevealed
            );

            return (
              <div
                key={`${rIndex}-${cIndex}`}
                className={classNames(styles.cell, asapCondensed.className)}
              >
                {cell.isRevealed ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 1 }}
                    transition={{
                      delay: cell.delay || 0,
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    }}
                    className={classNames(styles.cellRevealed, {
                      [styles.cellRevealedHint]: isHintOnly,
                      [styles.cellRevealedWord]: !isHintOnly,
                    })}
                  >
                    <span className={styles.cellChar}>{cell.char}</span>
                    {cell.isStartOfWord && cell.startWordId !== undefined && (
                      <div
                        className={classNames(styles.cellClue, {
                          [styles.cellClueH]: cell.startWordDirection === 'H',
                          [styles.cellClueV]: cell.startWordDirection === 'V',
                        })}
                      >
                        <span className={styles.cellClueArrow} />
                        <span className={styles.cellClueNumber}>
                          {cell.startWordId}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className={styles.cellHidden}>
                    {cell.isStartOfWord && cell.startWordId !== undefined && (
                      <div
                        className={classNames(styles.cellClue, {
                          [styles.cellClueH]: cell.startWordDirection === 'H',
                          [styles.cellClueV]: cell.startWordDirection === 'V',
                        })}
                      >
                        <span className={styles.cellClueArrow} />
                        <span className={styles.cellClueNumber}>
                          {cell.startWordId}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Grid;
