import { useTranslation } from '@/hooks/useTranslation';
import anim from '@/public/lotties/loading.json';
import styles from '@/styles/Loading.module.css';
import Lottie from 'lottie-react';

export const Loading = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.loadingOverlay}>
      <Lottie animationData={anim} loop={true} />
      <h2 className={styles.loadingTitle}>{t('connectingWords')}</h2>
    </div>
  );
};
