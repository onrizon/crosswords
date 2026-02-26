import styles from '@/styles/mobile/Modal.module.css';
import { AnimatePresence, motion } from "framer-motion";
import Lottie from 'lottie-react';

import { ModalContext } from '@/lib/Context';
import { ModalContextProps } from '@/types/modalTypes';
import { useContext } from 'react';

export default function Modal({ modal }: { modal: ModalContextProps["modal"] }) {
  const setModal = useContext(ModalContext) as ModalContextProps["setModal"];

  if (modal == null) return;

  return (
    <AnimatePresence>
      <div className={styles.modalOverlay}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={styles.modalContent}
        >
          <h2 className={styles.title}>{modal.title}</h2>

          <div className={styles.content}>
            <div className={styles.lottie}>
              <Lottie animationData={modal.lottie} loop={true} />
            </div>
            <p className={styles.description}>{modal.description}</p>
          </div>

          <div className={styles.buttons}>
            {modal.button ? (
              <>
                <button className={styles.btn} onClick={modal.button}>Sim</button>
                <button className={styles.btn} onClick={() => setModal(null)}>
                  Não
                </button>
              </>
            ) : (
              <button className={styles.btn} onClick={() => setModal(null)}>
                Ok
              </button>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};