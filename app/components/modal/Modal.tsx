import * as C from '@/constants';
import { withData } from '@/lib/Context';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Asap_Condensed } from 'next/font/google';
import AlertModal from './Alert';
import InfoModal from './info';
import SettingsModal from './settings';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

const Modal: React.FC<{ modal: { type: number; data: React.FC } }> = ({
  modal,
}) => {
  let Content = null;
  switch (modal.type) {
    case C.SETTINGS_MODAL:
      Content = <SettingsModal />;
      break;
    case C.INFO_MODAL:
      Content = <InfoModal />;
      break;
    case C.ALERT_MODAL:
      Content = <AlertModal />;
      break;
  }

  return (
    <>
      <AnimatePresence>
        {Content && (
          <div
            className={classNames(styles.modalOverlay, asapCondensed.className)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={styles.modalContent}
            >
              {Content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

function mapStateToProps(state: { modal: { type: number; data: React.FC } }): {
  modal: {
    type: number;
    data: React.FC;
  };
} {
  return {
    modal: state.modal,
  };
}

export default withData(Modal, mapStateToProps);
