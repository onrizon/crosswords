import styles from '@/styles/Settings.module.css';
import { SupportedLanguage } from '@/types';
import { motion } from 'framer-motion';
import { Save, Settings, X } from 'lucide-react';

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
    <div className={styles.modalOverlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={styles.modalContent}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <Settings className={styles.modalHeaderIconPurple} size={28} />
            <h2 className={styles.modalTitle}>Configurações</h2>
          </div>
          <button
            onClick={handleCloseSettingsWithoutSaving}
            className={styles.modalCloseBtn}
          >
            <X size={28} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Language */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Idioma / Language</label>
            <select
              value={tempSettings.language}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  language: e.target.value as SupportedLanguage,
                })
              }
              className={styles.formSelect}
            >
              <option value='pt'>Português (PT-BR)</option>
              <option value='en'>English (US)</option>
              <option value='fr'>Français</option>
              <option value='de'>Deutsch</option>
              <option value='it'>Italiano</option>
              <option value='es'>Español</option>
            </select>
          </div>

          {/* Duration */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Tempo da Rodada (Segundos)
            </label>
            <div className={styles.formRow}>
              <input
                type='number'
                min='30'
                max='600'
                value={tempSettings.duration}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    duration: parseInt(e.target.value) || 120,
                  })
                }
                className={styles.formInput}
                style={{ flex: 1 }}
              />
              <div className={styles.formDurationDisplay}>
                {Math.floor(tempSettings.duration / 60)}m{' '}
                {tempSettings.duration % 60}s
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            onClick={handleCloseSettingsWithoutSaving}
            className={styles.btnCancel}
          >
            Cancelar
          </button>
          <button onClick={handleSaveSettings} className={styles.btnSave}>
            <Save size={18} /> Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
