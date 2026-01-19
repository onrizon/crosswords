import * as C from '@/constants';
import { localeNames, useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import { Locale } from '@/locales';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';
import { useState } from 'react';
import { Select } from '../Select';
import { Switch } from '../Switch';

interface SettingsModalProps {
  handleModal: (type: number, data: React.FC) => void;
  locale: string;
  customDuration: number;
  showCameraArea: boolean;
  setCustomDuration: (duration: number) => void;
  setShowCameraArea: (show: boolean) => void;
  loadNewLevel: (language?: string, duration?: number) => void;
  setIsPaused: (paused: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  handleModal,
  locale,
  customDuration,
  showCameraArea,
  setCustomDuration,
  setShowCameraArea,
  loadNewLevel,
  setIsPaused,
}) => {
  const { t, locales } = useTranslation();
  const { changeLocale } = useTranslation();
  // Settings Form State (Temporary state while modal is open)
  const [tempSettings, setTempSettings] = useState<{
    language: string;
    duration: number;
    showCameraArea: boolean;
  }>({
    language: locale,
    duration: customDuration,
    showCameraArea,
  });
  const handleSaveSettings = () => {
    const hasLangChanged = tempSettings.language !== locale;
    const hasDurationChanged = tempSettings.duration !== customDuration;

    // Save to LocalStorage
    localStorage.setItem('streamCross', JSON.stringify(tempSettings));

    // Save to State
    changeLocale(tempSettings.language as Locale);
    setCustomDuration(tempSettings.duration);
    setShowCameraArea(tempSettings.showCameraArea);

    // If critical settings changed, reload level immediately
    if (hasLangChanged || hasDurationChanged) {
      loadNewLevel(tempSettings.language, tempSettings.duration);
    } else {
      setIsPaused(false);
    }
  };

  const handleSave = () => {
    handleSaveSettings();
    handleModal(C.CLOSED_MODAL, () => null);
  };

  return (
    <>
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
            className={classNames(styles.description, styles.switchDescription)}
          >
            <span>{t('cameraAreaDesc')}</span>
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
          onClick={() => handleModal(C.CLOSED_MODAL, () => null)}
          className={styles.btn}
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleSave}
          className={classNames(styles.btn, styles.btnPrimary)}
        >
          {t('save')}
        </button>
      </div>
    </>
  );
};

function mapStateToProps(state: SettingsModalProps): SettingsModalProps {
  return {
    handleModal: state.handleModal,
    locale: state.locale,
    customDuration: state.customDuration,
    showCameraArea: state.showCameraArea,
    setCustomDuration: state.setCustomDuration,
    setShowCameraArea: state.setShowCameraArea,
    loadNewLevel: state.loadNewLevel,
    setIsPaused: state.setIsPaused,
  };
}

export default withData(SettingsModal, mapStateToProps);
