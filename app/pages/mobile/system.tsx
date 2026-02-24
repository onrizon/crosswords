import Game from '@/components/mobile/Game';
import ModalContext from '@/components/mobile/ModalContext';
import Settings from '@/components/mobile/Settings';
import { useAuth } from '@/hooks/useAuth';
import { Context } from '@/lib/Context';
import styles from '@/styles/mobile/System.module.css';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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


export default function System() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isOwner, setIsOwner] = useState(true);
  const [status, setStatus] = useState(2);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/mobile');
    }
  }, [isAuthenticated, router]);

  return (
    <Context.Provider value={{ isOwner, setIsOwner }}>
      <ModalContext>
        <div className={styles.container}>
          {status === 1 && <Settings />}
          {status === 2 && <Game />}
        </div>
        <style jsx global>{`
        :root {
          --asap-condensed: ${asapCondensed.style.fontFamily};
          --nunito: ${nunito.style.fontFamily};
        }
      `}</style>
      </ModalContext>
    </Context.Provider>);
}