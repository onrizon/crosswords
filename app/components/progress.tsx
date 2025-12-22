import styles from '@/styles/Progress.module.css';
import { WordData } from '@/types';

export const Progress = ({ words, t }: { words: WordData[]; t: string }) => {
  const solvedCount = words.filter((w) => w.isRevealed).length;
  const totalCount = words.length;
  const progress =
    totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <span className={styles.label}>{t}</span>
        <span className={styles.value}>
          {solvedCount}
          <span className={styles.divider}>/</span>
          {totalCount}
        </span>
      </div>
      <div className={styles.circleContainer}>
        <svg className={styles.svg} viewBox='0 0 96 96'>
          <circle
            cx='48'
            cy='48'
            r='36'
            stroke='currentColor'
            strokeWidth='10'
            className={styles.circleBg}
            fill='none'
          />
          <circle
            cx='48'
            cy='48'
            r='36'
            stroke='currentColor'
            strokeWidth='10'
            className={styles.circleFg}
            fill='none'
            strokeDasharray='226.2'
            strokeDashoffset={226.2 - (226.2 * progress) / 100}
            strokeLinecap='round'
          />
        </svg>
        <span className={styles.percentage}>{progress}%</span>
      </div>
    </div>
  );
};
