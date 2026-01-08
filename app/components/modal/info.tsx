import * as C from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
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

const InfoModal = ({
  handleModal,
}: {
  handleModal: (type: number, data: React.FC) => void;
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
          <h2 className={styles.modalTitle}>{t('helpAndCommands')}</h2>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('chatCommands')}</h3>
            <div className={styles.grid}>
              <div className={styles.description}>
                <span
                  className={classNames(
                    nunitoSans.className,
                    styles.commandNameCyan
                  )}
                >
                  !refresh
                </span>
                <span className={nunitoSans.className}>
                  {t('generateNewLevel')}
                </span>
              </div>

              <div className={styles.description}>
                <span
                  className={classNames(
                    nunitoSans.className,
                    styles.commandNameRed
                  )}
                >
                  !reset
                </span>
                <span className={nunitoSans.className}>{t('resetScore')}</span>
              </div>

              <div className={styles.description}>
                <span
                  className={classNames(
                    nunitoSans.className,
                    styles.commandNameYellow
                  )}
                >
                  !pause
                </span>
                <span className={nunitoSans.className}>{t('pauseTime')}</span>
              </div>

              <div className={styles.description}>
                <span
                  className={classNames(
                    nunitoSans.className,
                    styles.commandNameEmerald
                  )}
                >
                  !play / !resume
                </span>
                <span className={nunitoSans.className}>{t('resumeTime')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            onClick={() => handleModal(C.CLOSED_MODAL, () => null)}
            className={classNames(
              styles.btn,
              styles.btnPrimary,
              asapCondensed.className
            )}
          >
            {t('ok')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

function mapStateToProps(state: {
  handleModal: (type: number, data: React.FC) => void;
}): {
  handleModal: (type: number, data: React.FC) => void;
} {
  return {
    handleModal: state.handleModal,
  };
}

export default withData(InfoModal, mapStateToProps);
