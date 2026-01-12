import * as C from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/Menu.module.css';
import classNames from 'classnames';

interface MenuProps {
  hit: boolean;
  isLoading: boolean;
  isPaused: boolean;
  handlePause: () => void;
  handleNextLevel: () => void;
  handleModal: (type: number, data: React.FC) => void;
}
const Menu: React.FC<MenuProps> = ({
  hit,
  isPaused,
  isLoading,
  handlePause,
  handleNextLevel,
  handleModal,
}) => {
  const { t } = useTranslation();
  return (
    <div className={classNames(styles.container, { [styles.hit]: hit })}>
      <button
        onClick={handlePause}
        className={classNames(styles.button, {
          [styles.btnPlay]: isPaused,
          [styles.btnPause]: !isPaused,
        })}
        title={isPaused ? t('resume') : t('pause')}
      >
        <span />
      </button>
      <button
        onClick={handleNextLevel}
        disabled={isLoading}
        className={classNames(styles.button, styles.btnRefresh)}
        title={t('generateNewLevel')}
      >
        <span />
      </button>
      <button
        onClick={() => handleModal(C.SETTINGS_MODAL, () => null)}
        disabled={isLoading}
        className={classNames(styles.button, styles.btnSettings)}
        title={t('settings')}
      >
        <span />
      </button>
      <button
        onClick={() => handleModal(C.INFO_MODAL, () => null)}
        className={classNames(styles.button, styles.btnInfo)}
        title={t('helpAndCommands')}
      >
        <span />
      </button>
      <button
        onClick={() => handleModal(C.ALERT_MODAL, () => null)}
        className={classNames(styles.button, styles.btnLogout)}
        title={t('logout')}
      >
        <span />
      </button>
    </div>
  );
};

function mapStateToProps(state: MenuProps): MenuProps {
  return {
    hit: state.hit,
    isLoading: state.isLoading,
    isPaused: state.isPaused,
    handlePause: state.handlePause,
    handleNextLevel: state.handleNextLevel,
    handleModal: state.handleModal,
  };
}

export default withData(Menu, mapStateToProps);
