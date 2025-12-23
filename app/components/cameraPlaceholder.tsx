import styles from '@/styles/CameraPlaceholder.module.css';
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

  return (
    <div className={`${styles.container} ${nunitoSans.className}`}>
      <div className={styles.borderContainer}>
        <div className={styles.header}>
          <div className={styles.icon} />
          <h3 className={styles.title}>
            {session?.user?.twitchLogin}
            <button
              onClick={handleLogout}
              disabled={isLoading || isSettingsOpen}
              className={styles.button}
              title='Logout'
            >
              <span />
            </button>
          </h3>
        </div>
      </div>
    </div>
  );
};
