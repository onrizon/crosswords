import styles from '@/styles/Layout.module.css';
import localFont from 'next/font/local';
import { useState } from 'react';
import * as C from '../constants';
import End from './End';
import Game from './Game';
import Modal from './modal/Modal';
import Start from './Start';

const asapCondensed = localFont({
  src: [
    { path: '../_assets/fonts/AsapCondensed-Medium.ttf', weight: '500' },
    { path: '../_assets/fonts/AsapCondensed-SemiBold.ttf', weight: '600' },
    { path: '../_assets/fonts/AsapCondensed-Bold.ttf', weight: '700' },
    { path: '../_assets/fonts/AsapCondensed-ExtraBold.ttf', weight: '800' },
    { path: '../_assets/fonts/AsapCondensed-Black.ttf', weight: '900' },
  ],
  variable: '--asap-condensed',
});

const nunito = localFont({
  src: [
    { path: '../_assets/fonts/Nunito-Medium.ttf', weight: '500' },
    { path: '../_assets/fonts/Nunito-SemiBold.ttf', weight: '600' },
    { path: '../_assets/fonts/Nunito-Bold.ttf', weight: '700' },
    { path: '../_assets/fonts/Nunito-ExtraBold.ttf', weight: '800' },
    { path: '../_assets/fonts/Nunito-Black.ttf', weight: '900' },
  ],
  variable: '--nunito',
});


const Layout: React.FC = () => {
  const [status, setStatus] = useState(C.STATUS_START);
  return (
    <div
      className={styles.layout}
    >
      {(() => {
        switch (status) {
          case C.STATUS_START:
            return <Start />;
          case C.STATUS_GAME:
            return <Game />;
          case C.STATUS_END:
            return <End />;
          default:
            return null;
        }
      })()}
      <Modal />
      <style jsx global>{`
        :root {
          --asap-condensed: ${asapCondensed.style.fontFamily};
          --nunito: ${nunito.style.fontFamily};
        }
      `}</style>
    </div>
  );
};

export default Layout;
