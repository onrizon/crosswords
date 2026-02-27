import End from '@/components/mobile/End';
import Game from '@/components/mobile/Game';
import ModalWrapper from '@/components/mobile/ModalWrapper';
import Settings from '@/components/mobile/Settings';
import { useAuth } from '@/hooks/useAuth';
import { SystemContext } from '@/lib/Context';

import * as C from '@/constants';
import styles from '@/styles/mobile/System.module.css';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { useState } from 'react';

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


export default function SystemWithModal() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isOwner, setIsOwner] = useState(true);
  const [status, setStatus] = useState(C.STATUS_START);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/mobile');
  //   }
  // }, [isAuthenticated, router]);

  return (
    <SystemContext.Provider value={{ isOwner }}>
      <ModalWrapper>
        <div className={styles.container}>
          {(() => {
            switch (status) {
              case C.STATUS_START:
                return <Settings />;
              case C.STATUS_GAME:
                return <Game />;
              case C.STATUS_END:
                return <End />;
              default:
                return null;
            }
          })()}
        </div>
        <style jsx global>{`
        :root {
          --asap-condensed: ${asapCondensed.style.fontFamily};
          --nunito: ${nunito.style.fontFamily};
        }
      `}</style>
      </ModalWrapper>
    </SystemContext.Provider>);
}