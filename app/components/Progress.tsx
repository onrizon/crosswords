import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/Progress.module.css';
import { WordData } from '@/types';
import classNames from 'classnames';
import { Asap_Condensed } from 'next/font/google';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

export const Progress = ({ words }: { words: WordData[] }) => {
  const { t } = useTranslation();
  const solvedCount = words.filter((w) => w.isRevealed).length;
  const totalCount = words.length;
  const progress =
    totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className={classNames(styles.container, asapCondensed.className)}>
      <div className={styles.top}>
        <div className={styles.icon}></div>
        <div className={styles.timeBar}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className={styles.text}>
        <span className={styles.label}>{t('progress')}</span>
        <span className={styles.value}>
          {solvedCount}
          <span className={styles.divider}>/</span>
          {totalCount}
        </span>
      </div>
    </div>
  );
};
