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
}: {
  isLoading: boolean;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isInfoOpen: boolean;
  handleOpenSettings: () => void;
  handleOpenInfo: () => void;
  handlePause: () => void;
  handleNextLevel: () => void;
}) => {
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
        title={isPaused ? 'Retomar' : 'Pausar'}
      >
        <span />
      </button>
      <button
        onClick={handleNextLevel}
        disabled={isLoading || isSettingsOpen || isInfoOpen}
        className={classNames(styles.button, styles.btnRefresh)}
        title='Gerar Novo Nível'
      >
        <span />
      </button>
      <button
        onClick={handleOpenSettings}
        disabled={isLoading || isInfoOpen}
        className={classNames(styles.button, styles.btnSettings)}
        title='Configurações'
      >
        <span />
      </button>
      <button
        onClick={handleOpenInfo}
        disabled={isLoading || isSettingsOpen}
        className={classNames(styles.button, styles.btnInfo)}
        title='Ajuda / Comandos'
      >
        <span />
      </button>
      <p className={classNames(styles.label, nunitoSans.className)}>live</p>
    </div>
  );
};
