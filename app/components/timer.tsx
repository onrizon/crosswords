import styles from '@/styles/Timer.module.css';
import { Asap_Condensed } from 'next/font/google';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

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
    <div className={`${styles.container} ${asapCondensed.className}`}>
      <div className={styles.top}>
        <div className={styles.icon}></div>
        <div className={styles.timeBar}>
          <span style={{ width: `${(timeLeft / 120) * 100}%` }} />
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.label}>{t}</span>
        <span
          className={`${styles.value} ${isWarning ? styles.valueWarning : ''}`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
};
