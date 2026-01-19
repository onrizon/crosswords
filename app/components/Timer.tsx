import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/Timer.module.css';
import classNames from 'classnames';

interface TimerProps {
  hit: boolean;
  timeLeft: number;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isInfoOpen: boolean;
  customDuration: number;
}

const Timer: React.FC<TimerProps> = ({
  hit,
  timeLeft,
  isPaused,
  isSettingsOpen,
  isInfoOpen,
  customDuration,
}) => {
  const { t } = useTranslation();
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning =
    timeLeft < 30 && !isPaused && !isSettingsOpen && !isInfoOpen;

  return (
    <div
      className={classNames(styles.container, {
        [styles.warning]: isWarning,
        [styles.hit]: hit,
      })}
    >
      <div className={styles.timeBar}>
        <span style={{ width: `${(timeLeft / customDuration) * 100}%` }} />
      </div>
      <div className={styles.bottom}>
        <div className={styles.icon}></div>
      <div className={styles.content}>
        <span className={styles.label}>{t('time')}</span>
        <span className={styles.value}>{formatTime(timeLeft)}</span>
      </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: TimerProps): TimerProps {
  return {
    hit: state.hit,
    timeLeft: state.timeLeft,
    isPaused: state.isPaused,
    isSettingsOpen: state.isSettingsOpen,
    isInfoOpen: state.isInfoOpen,
    customDuration: state.customDuration,
  };
}

export default withData(Timer, mapStateToProps);
