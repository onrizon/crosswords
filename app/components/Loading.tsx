import anim from '@/public/lotties/loading.json';
import styles from '@/styles/Loading.module.css';
import classNames from 'classnames';
import Lottie from 'lottie-react';
import { Asap_Condensed } from 'next/font/google';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

export const Loading = ({ t }: { t: string }) => {
  return (
    <div className={classNames(styles.loadingOverlay, asapCondensed.className)}>
      <Lottie animationData={anim} loop={true} />
      <h2 className={styles.loadingTitle}>{t}</h2>
    </div>
  );
};
