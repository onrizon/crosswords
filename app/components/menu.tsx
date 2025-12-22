import styles from '@/styles/Menu.module.css';
import {
  Info,
  Loader2,
  LogOut,
  Pause,
  Play,
  RefreshCw,
  Settings,
} from 'lucide-react';

export const Menu = ({
  isPaused,
  isLoading,
  isSettingsOpen,
  isInfoOpen,
  handleOpenSettings,
  handleOpenInfo,
  handleLogout,
  handlePause,
  handleNextLevel,
}: {
  isLoading: boolean;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isInfoOpen: boolean;
  handleOpenSettings: () => void;
  handleOpenInfo: () => void;
  handleLogout: () => void;
  handlePause: () => void;
  handleNextLevel: () => void;
}) => {
  return (
    <div className={styles.container}>
      <button
        onClick={handlePause}
        disabled={isSettingsOpen || isInfoOpen}
        className={`${styles.button} ${
          isSettingsOpen || isInfoOpen ? styles.buttonPausedDisabled : ''
        }`}
        title={isPaused ? 'Retomar' : 'Pausar'}
      >
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>
      <button
        onClick={handleNextLevel}
        disabled={isLoading || isSettingsOpen || isInfoOpen}
        className={styles.button}
        title='Gerar Novo Nível'
      >
        {isLoading ? (
          <Loader2 size={24} className={styles.loadingIcon} />
        ) : (
          <RefreshCw size={24} />
        )}
      </button>
      <button
        onClick={handleOpenSettings}
        disabled={isLoading || isInfoOpen}
        className={styles.button}
        title='Configurações'
      >
        <Settings size={24} />
      </button>
      <button
        onClick={handleOpenInfo}
        disabled={isLoading || isSettingsOpen}
        className={styles.button}
        title='Ajuda / Comandos'
      >
        <Info size={24} />
      </button>
      <button
        onClick={handleLogout}
        disabled={isLoading || isSettingsOpen}
        className={styles.button}
        title='Ajuda / Comandos'
      >
        <LogOut size={24} />
      </button>
    </div>
  );
};
