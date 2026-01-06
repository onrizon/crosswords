import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/CameraPlaceholder.module.css';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { Nunito_Sans } from 'next/font/google';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-nunito-sans',
});

export const CameraPlaceholder = ({
  isLoading,
  isSettingsOpen,
  handleLogout,
}: {
  isLoading: boolean;
  isSettingsOpen: boolean;
  handleLogout: () => void;
}) => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  return (
    <div className={classNames(styles.container, nunitoSans.className)}>
      <div className={styles.containerEdge}>
        <div className={styles.header}>
          <div className={styles.icon} />
          <h3 className={styles.title}>
            {session?.user?.twitchLogin}
            <button
              onClick={handleLogout}
              disabled={isLoading || isSettingsOpen}
              className={styles.button}
              title={t('logout')}
            >
              <span />
            </button>
          </h3>
        </div>
        <div className={styles.text}>
          <span />
          {t('insertYourCamera')}
        </div>
      </div>
    </div>
  );
};
