import * as C from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';

interface InfoModalProps {
  handleModal: (type: number, data: React.FC) => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ handleModal }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{t('helpAndCommands')}</h2>
      </div>

      <div className={styles.body}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('chatCommands')}</h3>
          <div className={styles.grid}>
            <div className={styles.description}>
              <span className={styles.commandNameCyan}>!refresh</span>
              <span>{t('generateNewLevel')}</span>
            </div>

            <div className={styles.description}>
              <span className={styles.commandNameRed}>!reset</span>
              <span>{t('resetScore')}</span>
            </div>

            <div className={styles.description}>
              <span className={styles.commandNameYellow}>!pause</span>
              <span>{t('pauseTime')}</span>
            </div>

            <div className={styles.description}>
              <span className={styles.commandNameEmerald}>!play / !resume</span>
              <span>{t('resumeTime')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <button
          onClick={() => handleModal(C.CLOSED_MODAL, () => null)}
          className={classNames(styles.btn, styles.btnPrimary)}
        >
          {t('ok')}
        </button>
      </div>
    </>
  );
};

function mapStateToProps(state: InfoModalProps): InfoModalProps {
  return {
    handleModal: state.handleModal,
  };
}

export default withData(InfoModal, mapStateToProps);
