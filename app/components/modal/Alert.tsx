import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';
import { motion } from 'framer-motion';
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

export const AlertModal = ({
  handleLogout,
  handleCloseAlert,
}: {
  handleLogout: () => void;
  handleCloseAlert: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className={classNames(styles.modalOverlay, asapCondensed.className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={styles.modalContent}
      >
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
            onClick={handleCloseAlert}
            className={classNames(styles.btn, asapCondensed.className)}
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleLogout}
            className={classNames(
              styles.btn,
              styles.btnPrimary,
              asapCondensed.className
            )}
          >
            {t('confirm')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
