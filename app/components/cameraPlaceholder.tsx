import styles from '@/styles/CameraPlaceholder.module.css';
import { Video } from 'lucide-react';

export const CameraPlaceholder = ({
  t,
}: {
  t: { streamOverlay: string; live: string };
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        <Video size={48} className={styles.icon} />
        <span className={styles.text}>{t.streamOverlay}</span>
      </div>
      <div className={styles.liveBadge}>{t.live}</div>
    </div>
  );
};
