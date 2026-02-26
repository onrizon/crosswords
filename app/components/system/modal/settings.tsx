import * as C from '@/constants';
import { localeNames, useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import { Locale } from '@/locales';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';
import { useState } from 'react';
import { Select } from '../common/Select';

interface SettingsModalProps {
  handleModal: (type: number, data: React.FC) => void;
  locale: string;
  customDuration: number;
  setCustomDuration: (duration: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  handleModal,
  locale,
  customDuration,
  setCustomDuration,
}) => {
  const { t, locales } = useTranslation();
  const { changeLocale } = useTranslation();
  const [tempSettings, setTempSettings] = useState<{
    language: string;
    duration: number;
  }>({
    language: locale,
    duration: customDuration,
  });

  const handleSave = () => {
    localStorage.setItem('streamCross', JSON.stringify(tempSettings));
    changeLocale(tempSettings.language as Locale);
    if (setCustomDuration) setCustomDuration(tempSettings.duration);
    handleModal(C.CLOSED_MODAL, () => null);
  };

  return (
    <>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{t('settings')}</h2>
      </div>

      <div className={styles.body}>
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
    setCustomDuration: state.setCustomDuration,
  };
}

export default withData(SettingsModal, mapStateToProps);
