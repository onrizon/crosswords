import infoStyles from '@/styles/Info.module.css';
import styles from '@/styles/Settings.module.css';
import { motion } from 'framer-motion';
import { Crown, Info, Radio, X } from 'lucide-react';

export const InfoModal = ({
  handleCloseInfo,
  t,
}: {
  handleCloseInfo: () => void;
  t: {
    infoTitle: string;
    howToPlay: string;
    howToPlayDesc: string;
    commands: string;
    cmdDesc: string;
  };
}) => {
  return (
    <div className={styles.modalOverlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={styles.modalContent}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <Info className={styles.modalHeaderIconCyan} size={28} />
            <h2 className={styles.modalTitle}>{t.infoTitle}</h2>
          </div>
          <button onClick={handleCloseInfo} className={styles.modalCloseBtn}>
            <X size={28} />
          </button>
        </div>

        <div className={infoStyles.body}>
          {/* How to Play */}
          <div className={infoStyles.section}>
            <div
              className={`${infoStyles.sectionHeader} ${infoStyles.sectionHeaderYellow}`}
            >
              <Crown size={20} />
              <h3 className={infoStyles.sectionTitle}>{t.howToPlay}</h3>
            </div>
            <p className={infoStyles.description}>{t.howToPlayDesc}</p>
          </div>

          {/* Commands */}
          <div className={infoStyles.section}>
            <div
              className={`${infoStyles.sectionHeader} ${infoStyles.sectionHeaderPurple}`}
            >
              <Radio size={20} />
              <h3 className={infoStyles.sectionTitle}>{t.commands}</h3>
            </div>
            <div>
              <p className={infoStyles.commandsLabel}>{t.cmdDesc}</p>
              <div className={infoStyles.commandsGrid}>
                <div className={infoStyles.commandCard}>
                  <span
                    className={`${infoStyles.commandName} ${infoStyles.commandNameCyan}`}
                  >
                    !refresh
                  </span>
                  <span className={infoStyles.commandDesc}>
                    Gerar novo nível
                  </span>
                </div>
                <div className={infoStyles.commandCard}>
                  <span
                    className={`${infoStyles.commandName} ${infoStyles.commandNameRed}`}
                  >
                    !reset
                  </span>
                  <span className={infoStyles.commandDesc}>
                    Zerar pontuação
                  </span>
                </div>
                <div className={infoStyles.commandCard}>
                  <span
                    className={`${infoStyles.commandName} ${infoStyles.commandNameYellow}`}
                  >
                    !pause
                  </span>
                  <span className={infoStyles.commandDesc}>Pausar tempo</span>
                </div>
                <div className={infoStyles.commandCard}>
                  <span
                    className={`${infoStyles.commandName} ${infoStyles.commandNameEmerald}`}
                  >
                    !play / !resume
                  </span>
                  <span className={infoStyles.commandDesc}>Retomar tempo</span>
                </div>
                <div
                  className={`${infoStyles.commandCard} ${infoStyles.commandCardWide}`}
                >
                  <span
                    className={`${infoStyles.commandName} ${infoStyles.commandNameOrange}`}
                  >
                    !hint
                  </span>
                  <span className={infoStyles.commandDesc}>
                    Revela uma letra (Prioridade: Interseções)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={infoStyles.footer}>
          <button onClick={handleCloseInfo} className={styles.btnUnderstood}>
            Entendido
          </button>
        </div>
      </motion.div>
    </div>
  );
};
