import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/Progress.module.css';
import { WordData } from '@/types';
import classNames from 'classnames';

interface ProgressProps {
  hit: boolean;
  words: WordData[];
}

const Progress: React.FC<ProgressProps> = ({ hit, words }) => {
  const { t } = useTranslation();
  const solvedCount = words.filter((w) => w.isRevealed).length;
  const totalCount = words.length;
  const progress =
    totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className={classNames(styles.container, { [styles.hit]: hit })}>
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

function mapStateToProps(state: ProgressProps): ProgressProps {
  return {
    hit: state.hit,
    words: state.words,
  };
}

export default withData(Progress, mapStateToProps);
