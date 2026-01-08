import * as C from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';
import { Asap_Condensed, Nunito_Sans } from 'next/font/google';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['600', '800'],
  variable: '--font-nunito-sans',
});

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

const AlertModal = ({
  handleLogout,
  handleModal,
}: {
  handleLogout: () => void;
  handleModal: (type: number, data: React.FC) => void;
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    handleLogout();
    handleModal(C.CLOSED_MODAL, () => null);
  };

  return (
    <>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{t('disconnetAccout')}</h2>
      </div>

      <div className={styles.body}>
        <span className={styles.alertIco}></span>
        <p className={classNames(styles.text, nunitoSans.className)}>
          {t('confirmDisconnect')}
        </p>
      </div>
      <div className={styles.footer}>
        <button
          onClick={() => handleModal(C.CLOSED_MODAL, () => null)}
          className={classNames(styles.btn, asapCondensed.className)}
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleConfirm}
          className={classNames(
            styles.btn,
            styles.btnPrimary,
            asapCondensed.className
          )}
        >
          {t('confirm')}
        </button>
      </div>
    </>
  );
};

function mapStateToProps(state: {
  handleLogout: () => void;
  handleModal: (type: number, data: React.FC) => void;
}): {
  handleLogout: () => void;
  handleModal: (type: number, data: React.FC) => void;
} {
  return {
    handleLogout: state.handleLogout,
    handleModal: state.handleModal,
  };
}

export default withData(AlertModal, mapStateToProps);
