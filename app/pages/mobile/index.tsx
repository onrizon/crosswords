import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/mobile/Index.module.css';
import classNames from 'classnames';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const asapCondensed = localFont({
  src: [
    { path: '../../_assets/fonts/AsapCondensed-Medium.ttf', weight: '500' },
    { path: '../../_assets/fonts/AsapCondensed-SemiBold.ttf', weight: '600' },
    { path: '../../_assets/fonts/AsapCondensed-Bold.ttf', weight: '700' },
    { path: '../../_assets/fonts/AsapCondensed-ExtraBold.ttf', weight: '800' },
    { path: '../../_assets/fonts/AsapCondensed-Black.ttf', weight: '900' },
  ],
  variable: '--asap-condensed',
});

const nunito = localFont({
  src: [
    { path: '../../_assets/fonts/Nunito-Medium.ttf', weight: '500' },
    { path: '../../_assets/fonts/Nunito-SemiBold.ttf', weight: '600' },
    { path: '../../_assets/fonts/Nunito-Bold.ttf', weight: '700' },
    { path: '../../_assets/fonts/Nunito-ExtraBold.ttf', weight: '800' },
    { path: '../../_assets/fonts/Nunito-Black.ttf', weight: '900' },
  ],
  variable: '--nunito',
});

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, loginWithTwitch, loginWithDiscord } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/mobile/system');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return <div className={styles.container}>
    <div className={styles.logo}></div>
    <div className={styles.content}>
      <h2>CRIAR SALA</h2>
      <div className={styles.box}>
        <h4>
          <div className={styles.icon} />
          Seu nickname
        </h4>
        <input className={styles.input} type="text" placeholder="Player2234" />
        <button
          onClick={() => { }}
          className={classNames(styles.btn, styles.btnPrimary)}
        >
          Entrar
        </button>
        <p className={styles.or}>OU</p>
        <div className={styles.buttons}>
          <button onClick={() => loginWithTwitch()} className={classNames(styles.btn, styles.btnSecondary, styles.twitch)}>
            <div className={styles.icon} />
            Twitch
          </button>
          <button onClick={() => loginWithDiscord()} className={classNames(styles.btn, styles.btnSecondary, styles.discord)}>
            <div className={styles.icon} />
            Discord
          </button>
        </div>
      </div>
    </div>
    <p className={styles.copyright}>2026 . Onrizon Social Games</p>
    <style jsx global>{`
        :root {
          --asap-condensed: ${asapCondensed.style.fontFamily};
          --nunito: ${nunito.style.fontFamily};
        }
      `}</style>
  </div>;
}