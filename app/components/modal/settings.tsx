import styles from '@/styles/Modal.module.css';
import { SupportedLanguage } from '@/types';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Asap_Condensed } from 'next/font/google';
import { Select } from '../Select';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

export const SettingsModal = ({
  handleCloseSettingsWithoutSaving,
  handleSaveSettings,
  tempSettings,
  setTempSettings,
}: {
  handleCloseSettingsWithoutSaving: () => void;
  handleSaveSettings: () => void;
  tempSettings: {
    language: SupportedLanguage;
    duration: number;
    webhookUrl: string;
  };
  setTempSettings: (settings: {
    language: SupportedLanguage;
    duration: number;
    webhookUrl: string;
  }) => void;
}) => {
  return (
    <div className={classNames(styles.modalOverlay, asapCondensed.className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={styles.modalContent}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>CONFIGURAÇÕES</h2>
        </div>

        <div className={styles.body}>
          {/* Language */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Idioma / Language</h3>
            <Select
              value={tempSettings.language}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  language: e.target.value as SupportedLanguage,
                })
              }
              options={[
                { value: 'pt', label: 'Português (PT-BR)' },
                { value: 'en', label: 'English (US)' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' },
                { value: 'it', label: 'Italiano' },
                { value: 'es', label: 'Español' },
              ]}
            />
          </div>

          {/* Duration */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Tempo da Rodada</h3>
            <Select
              value={tempSettings.duration}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  duration: parseInt(e.target.value) || 120,
                })
              }
              options={[
                { value: 30, label: '30 segundos' },
                { value: 60, label: '1 minuto' },
                { value: 90, label: '1 minuto e 30 segundos' },
                { value: 120, label: '2 minutos' },
                { value: 150, label: '2 minutos e 30 segundos' },
                { value: 180, label: '3 minutos' },
                { value: 210, label: '3 minutos e 30 segundos' },
                { value: 240, label: '4 minutos' },
                { value: 270, label: '4 minutos e 30 segundos' },
                { value: 300, label: '5 minutos' },
              ]}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <button
            onClick={handleCloseSettingsWithoutSaving}
            className={classNames(styles.btn, asapCondensed.className)}
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveSettings}
            className={classNames(
              styles.btn,
              styles.btnPrimary,
              asapCondensed.className
            )}
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
