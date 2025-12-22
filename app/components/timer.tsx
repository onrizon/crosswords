import styles from '@/styles/Timer.module.css';
import { Clock } from 'lucide-react';

export const Timer = ({
  timeLeft,
  isPaused,
  isSettingsOpen,
  isInfoOpen,
  t,
}: {
  timeLeft: number;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isInfoOpen: boolean;
  t: string;
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning =
    timeLeft < 30 && !isPaused && !isSettingsOpen && !isInfoOpen;

  return (
    <div className={styles.container}>
      <Clock
        size={28}
        className={isWarning ? styles.iconWarning : styles.icon}
      />
      <div className={styles.content}>
        <span
          className={`${styles.value} ${isWarning ? styles.valueWarning : ''}`}
        >
          {formatTime(timeLeft)}
        </span>
        <span className={styles.label}>{t}</span>
      </div>
    </div>
  );
};
