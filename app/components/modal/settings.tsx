import * as C from '@/constants';
import { localeNames, useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import { Locale } from '@/locales';
import styles from '@/styles/Modal.module.css';
import classNames from 'classnames';
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

const SettingsModal = ({
  handleSaveSettings,
  tempSettings,
  setTempSettings,
  handleModal,
}: {
  handleSaveSettings: () => void;
  tempSettings: {
    language: string;
    duration: number;
    showCameraArea: boolean;
  };
  setTempSettings: (settings: {
    language: string;
    duration: number;
    showCameraArea: boolean;
  }) => void;
  handleModal: (type: number, data: React.FC) => void;
}) => {
  const { t, locales } = useTranslation();

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
            <span className={nunitoSans.className}>{t('cameraAreaDesc')}</span>
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
          className={classNames(styles.btn, asapCondensed.className)}
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleSave}
          className={classNames(
            styles.btn,
            styles.btnPrimary,
            asapCondensed.className
          )}
        >
          {t('save')}
        </button>
      </div>
    </>
  );
};

function mapStateToProps(state: {
  handleModal: (type: number, data: React.FC) => void;
  handleSaveSettings: () => void;
  tempSettings: {
    language: string;
    duration: number;
    showCameraArea: boolean;
  };
  setTempSettings: (settings: {
    language: string;
    duration: number;
    showCameraArea: boolean;
  }) => void;
}): {
  handleModal: (type: number, data: React.FC) => void;
  handleSaveSettings: () => void;
  tempSettings: {
    language: string;
    duration: number;
    showCameraArea: boolean;
  };
  setTempSettings: (settings: {
    language: string;
    duration: number;
    showCameraArea: boolean;
  }) => void;
} {
  return {
    handleModal: state.handleModal,
    handleSaveSettings: state.handleSaveSettings,
    tempSettings: state.tempSettings,
    setTempSettings: state.setTempSettings,
  };
}

export default withData(SettingsModal, mapStateToProps);
