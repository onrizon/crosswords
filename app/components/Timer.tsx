import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/Timer.module.css';
import classNames from 'classnames';

interface TimerProps {
  timeLeft: number;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isInfoOpen: boolean;
  tempSettings: { duration: number };
}

const Timer: React.FC<TimerProps> = ({
  timeLeft,
  isPaused,
  isSettingsOpen,
  isInfoOpen,
  tempSettings,
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
      })}
    >
      <div className={styles.top}>
        <div className={styles.icon}></div>
        <div className={styles.timeBar}>
          <span
            style={{ width: `${(timeLeft / tempSettings.duration) * 100}%` }}
          />
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.label}>{t('time')}</span>
        <span className={styles.value}>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

function mapStateToProps(state: TimerProps): TimerProps {
  return {
    timeLeft: state.timeLeft,
    isPaused: state.isPaused,
    isSettingsOpen: state.isSettingsOpen,
    isInfoOpen: state.isInfoOpen,
    tempSettings: state.tempSettings,
  };
}

export default withData(Timer, mapStateToProps);
