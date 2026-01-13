import * as C from '@/constants';
import styles from '@/styles/Grid.module.css';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { CellData, WordData } from '../types';

import { withData } from '@/lib/Context';
import classNames from 'classnames';

interface GridProps {
  hit: boolean;
  lastHitInfo: { username: string; word: string; index: number };
  words: WordData[];
}

const Grid: React.FC<GridProps> = ({ hit, lastHitInfo, words }) => {
  // Compute the grid cells based on words
  const cells = useMemo(() => {
    const grid: (CellData | null)[][] = Array(C.GRID_ROWS)
      .fill(null)
      .map(() => Array(C.GRID_COLS).fill(null));

    words.forEach((w) => {
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'V' ? w.start.row + i : w.start.row;
        const c = w.direction === 'H' ? w.start.col + i : w.start.col;

        if (r >= C.GRID_ROWS || c >= C.GRID_COLS) continue;

        const existing = grid[r][c];
        const isStart = i === 0;

        // Merge data if intersection
        grid[r][c] = {
          char: w.word[i],
          // wordId: existing ? existing.wordId : w.id, // Keep primary existing or set new
          words: [
            ...(existing ? existing.words : []),
            { id: w.id, start: isStart, direction: w.direction },
          ],
          // Cell is revealed if the word is revealed, OR if it was previously revealed (intersection), OR if it is a hint
          isRevealed: w.isRevealed || (existing ? existing.isRevealed : false),
          row: r,
          col: c,
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
          gridTemplateColumns: `repeat(${C.GRID_COLS}, minmax(0, 1fr))`,
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

            const wordHit = hit
              ? cell.words.find((w) => w.id === lastHitInfo?.index)
              : undefined;
            return (
              <>
                <div key={`${rIndex}-${cIndex}`} className={styles.cell}>
                  {cell.words
                    .filter((w) => w.start)
                    .map((w) => (
                      <div
                        key={w.direction}
                        className={classNames(styles.cellClue, {
                          [styles.cellClueH]: w.direction.includes('H'),
                          [styles.cellClueV]: w.direction.includes('V'),
                        })}
                      >
                        <span className={styles.cellClueArrow} />
                        <span className={styles.cellClueNumber}>{w.id}</span>
                      </div>
                    ))}
                  <div className={styles.cellHidden}>
                    {wordHit && wordHit.start && (
                      <>
                        {wordHit.direction.includes('H') ? (
                          <div
                            className={classNames(
                              styles.wordGlow,
                              styles.wordGlowH
                            )}
                            style={{
                              width: lastHitInfo.word.length * 10 + 'px',
                            }}
                          />
                        ) : (
                          <div
                            className={classNames(
                              styles.wordGlow,
                              styles.wordGlowV
                            )}
                            style={{
                              height: lastHitInfo.word.length * 10 + 'px',
                            }}
                          />
                        )}
                        <div className={styles.wordEffect} />
                      </>
                    )}

                    {cell.isRevealed && (
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
                          [styles.cellHit]: !!wordHit,
                        })}
                      >
                        <span className={styles.cellChar}>{cell.char}</span>
                        {cell.words
                          .filter((w) => w.start)
                          .map((w) => (
                            <div
                              key={w.direction}
                              className={classNames(styles.cellClue, {
                                [styles.cellClueH]: w.direction.includes('H'),
                                [styles.cellClueV]: w.direction.includes('V'),
                              })}
                            >
                              <span className={styles.cellClueArrow} />
                              <span className={styles.cellClueNumber}>
                                {w.id}
                              </span>
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </>
            );
          })
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state: {
  lastHitInfo: { username: string; word: string; index: number };
  hit: boolean;
  words: WordData[];
}): {
  lastHitInfo: { username: string; word: string; index: number };
  hit: boolean;
  words: WordData[];
} {
  return {
    lastHitInfo: state.lastHitInfo,
    hit: state.hit,
    words: state.words,
  };
}

export default withData(Grid, mapStateToProps);
