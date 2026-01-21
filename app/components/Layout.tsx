import styles from '@/styles/Layout.module.css';
import classNames from 'classnames';
import { Asap_Condensed, Nunito_Sans } from 'next/font/google';
import { useState } from 'react';
import * as C from '../constants';
import End from './End';
import Game from './Game';
import Modal from './modal/Modal';
import Start from './Start';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['600', '800'],
  variable: '--font-nunito-sans',
});

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

const Layout: React.FC = () => {
  const [status, setStatus] = useState(C.STATUS_START);
  return (
    <div
      className={classNames(
        styles.layout,
        nunitoSans.className,
        asapCondensed.className
      )}
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
    </div>
  );
};

export default Layout;
