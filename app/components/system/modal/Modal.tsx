import * as C from '@/constants';
import { withData } from '@/lib/Context';
import styles from '@/styles/Modal.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import AlertModal from './Alert';
import InfoModal from './info';
import SettingsModal from './settings';

interface ModalProps {
  modal: { type: number; data: React.FC };
}

const Modal: React.FC<ModalProps> = ({ modal }) => {
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
          <div className={styles.modalOverlay}>
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

function mapStateToProps(state: ModalProps): ModalProps {
  return {
    modal: state.modal,
  };
}

export default withData(Modal, mapStateToProps);
