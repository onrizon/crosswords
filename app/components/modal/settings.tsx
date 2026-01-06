import { localeNames, useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/locales';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Asap_Condensed, Nunito_Sans } from 'next/font/google';
import { Select } from '../Select';
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

export const SettingsModal = ({
  handleCloseSettingsWithoutSaving,
  handleSaveSettings,
  tempSettings,
  setTempSettings,
}: {
  handleCloseSettingsWithoutSaving: () => void;
  handleSaveSettings: () => void;
  tempSettings: {
    language: string;
    duration: number;
    webhookUrl: string;
    showCameraArea: boolean;
  };
  setTempSettings: (settings: {
    language: string;
    duration: number;
    webhookUrl: string;
    showCameraArea: boolean;
  }) => void;
}) => {
  const { t, locales } = useTranslation();

  return (
    <div className={classNames(styles.modalOverlay, asapCondensed.className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={styles.modalContent}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{t('settings')}</h2>
        </div>

        <div className={styles.body}>
          {/* Language */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('language')}</h3>
            <Select
              value={tempSettings.language}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  language: e.target.value as Locale,
                })
              }
              options={locales.map((locale) => ({
                value: locale,
                label: localeNames[locale],
              }))}
            />
          </div>

          {/* Duration */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('roundTime')}</h3>
            <Select
              value={tempSettings.duration}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  duration: parseInt(e.target.value) || 120,
                })
              }
              options={[
                { value: 30, label: `30 ${t('seconds')}` },
                { value: 60, label: `1 ${t('minute')}` },
                {
                  value: 90,
                  label: `1 ${t('minute')} ${t('and')} 30 ${t('seconds')}`,
                },
                { value: 120, label: `2 ${t('minutes')}` },
                {
                  value: 150,
                  label: `2 ${t('minutes')} ${t('and')} 30 ${t('seconds')}`,
                },
                { value: 180, label: `3 ${t('minutes')}` },
                {
                  value: 210,
                  label: `3 ${t('minutes')} ${t('and')} 30 ${t('seconds')}`,
                },
                { value: 240, label: `4 ${t('minutes')}` },
                {
                  value: 270,
                  label: `4 ${t('minutes')} ${t('and')} 30 ${t('seconds')}`,
                },
                { value: 300, label: `5 ${t('minutes')}` },
              ]}
            />
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('cameraArea')}</h3>
            <div
              className={classNames(
                styles.description,
                styles.switchDescription
              )}
            >
              <span className={nunitoSans.className}>
                {t('cameraAreaDesc')}
              </span>
              <Switch
                checked={tempSettings.showCameraArea}
                onChange={() =>
                  setTempSettings({
                    ...tempSettings,
                    showCameraArea: !tempSettings.showCameraArea,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            onClick={handleCloseSettingsWithoutSaving}
            className={classNames(styles.btn, asapCondensed.className)}
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSaveSettings}
            className={classNames(
              styles.btn,
              styles.btnPrimary,
              asapCondensed.className
            )}
          >
            {t('save')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
