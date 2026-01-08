import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/CameraPlaceholder.module.css';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { Nunito_Sans } from 'next/font/google';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-nunito-sans',
});

const CameraPlaceholder: React.FC<{ showCameraArea: boolean }> = ({
  showCameraArea,
}) => {
  const { data: session } = useSession();
  const { t } = useTranslation();

  if (!showCameraArea) return null;

  return (
    <div className={classNames(styles.container, nunitoSans.className)}>
      <div className={styles.containerEdge}>
        <div className={styles.header}>
          <div className={styles.icon} />
          <h3 className={styles.title}>{session?.user?.twitchLogin}</h3>
        </div>
        <div className={styles.text}>
          <span />
          {t('insertYourCamera')}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: { showCameraArea: boolean }): {
  showCameraArea: boolean;
} {
  return {
    showCameraArea: state.showCameraArea,
  };
}

export default withData(CameraPlaceholder, mapStateToProps);
