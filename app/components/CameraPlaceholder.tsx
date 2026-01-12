import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/CameraPlaceholder.module.css';
import { useSession } from 'next-auth/react';

interface CameraPlaceholderProps {
  showCameraArea: boolean;
}

const CameraPlaceholder: React.FC<CameraPlaceholderProps> = ({
  showCameraArea,
}) => {
  const { data: session } = useSession();
  const { t } = useTranslation();

  if (!showCameraArea) return null;

  return (
    <div className={styles.container}>
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

function mapStateToProps(
  state: CameraPlaceholderProps
): CameraPlaceholderProps {
  return {
    showCameraArea: state.showCameraArea,
  };
}

export default withData(CameraPlaceholder, mapStateToProps);
