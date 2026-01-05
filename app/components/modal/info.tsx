import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Asap_Condensed, Nunito_Sans } from 'next/font/google';
import { useState } from 'react';
import { Switch } from '../Switch';

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

export const InfoModal = ({
  handleCloseInfo,
}: {
  handleCloseInfo: () => void;
}) => {
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };

  return (
    <div className={classNames(styles.modalOverlay, asapCondensed.className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={styles.modalContent}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>AJUDA E COMANDOS</h2>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>COMANDOS DE CHAT (ADMIN)</h3>
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
                <span className={nunitoSans.className}>Gerar novo nível</span>
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
                <span className={nunitoSans.className}>Zerar pontuação</span>
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
                <span className={nunitoSans.className}>Pausar tempo</span>
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
                <span className={nunitoSans.className}>Retomar tempo</span>
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>ÁREA DE CÂMERA</h3>
            <div
              className={classNames(
                styles.description,
                styles.switchDescription
              )}
            >
              <span className={nunitoSans.className}>
                Ativa ou desativa a área da câmera, liberando mais espaço para o
                ranking.
              </span>
              <Switch checked={checked} onChange={handleCheck} />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            onClick={handleCloseInfo}
            className={classNames(
              styles.btn,
              styles.btnPrimary,
              asapCondensed.className
            )}
          >
            Ok
          </button>
        </div>
      </motion.div>
    </div>
  );
};
