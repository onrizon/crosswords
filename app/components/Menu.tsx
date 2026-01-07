import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/Menu.module.css';
import classNames from 'classnames';
import { Nunito_Sans } from 'next/font/google';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-nunito-sans',
});

export const Menu = ({
  isPaused,
  isLoading,
  isSettingsOpen,
  isInfoOpen,
  handleOpenSettings,
  handleOpenInfo,
  handlePause,
  handleNextLevel,
  handleOpenAlert,
}: {
  isLoading: boolean;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isInfoOpen: boolean;
  handleOpenSettings: () => void;
  handleOpenInfo: () => void;
  handlePause: () => void;
  handleNextLevel: () => void;
  handleOpenAlert: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <button
        onClick={handlePause}
        disabled={isSettingsOpen || isInfoOpen}
        className={classNames(styles.button, {
          [styles.buttonPausedDisabled]: isSettingsOpen || isInfoOpen,
          [styles.btnPlay]: isPaused,
          [styles.btnPause]: !isPaused,
        })}
        title={isPaused ? t('resume') : t('pause')}
      >
        <span />
      </button>
      <button
        onClick={handleNextLevel}
        disabled={isLoading || isSettingsOpen || isInfoOpen}
        className={classNames(styles.button, styles.btnRefresh)}
        title={t('generateNewLevel')}
      >
        <span />
      </button>
      <button
        onClick={handleOpenSettings}
        disabled={isLoading || isInfoOpen}
        className={classNames(styles.button, styles.btnSettings)}
        title={t('settings')}
      >
        <span />
      </button>
      <button
        onClick={handleOpenInfo}
        disabled={isLoading || isSettingsOpen}
        className={classNames(styles.button, styles.btnInfo)}
        title={t('helpAndCommands')}
      >
        <span />
      </button>
      <button
        onClick={handleOpenAlert}
        disabled={isLoading || isSettingsOpen}
        className={classNames(styles.button, styles.btnLogout)}
        title={t('logout')}
      >
        <span />
      </button>
    </div>
  );
};
