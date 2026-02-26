import * as C from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';

interface AlertModalProps {
  handleModal: (type: number, data: React.FC) => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  handleModal,
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    handleModal(C.CLOSED_MODAL, () => null);
  };

  return (
    <>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{t('disconnetAccout')}</h2>
      </div>

      <div className={styles.body}>
        <span className={styles.alertIco}></span>
        <p className={styles.text}>{t('confirmDisconnect')}</p>
      </div>
      <div className={styles.footer}>
        <button
          onClick={() => handleModal(C.CLOSED_MODAL, () => null)}
          className={styles.btn}
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleConfirm}
          className={classNames(styles.btn, styles.btnPrimary)}
        >
          {t('confirm')}
        </button>
      </div>
    </>
  );
};

function mapStateToProps(state: AlertModalProps): AlertModalProps {
  return {
    handleModal: state.handleModal,
  };
}

export default withData(AlertModal, mapStateToProps);
