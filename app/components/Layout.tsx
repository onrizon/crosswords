import { withData } from '@/lib/Context';
import styles from '@/styles/Layout.module.css';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Asap_Condensed, Nunito_Sans } from 'next/font/google';
import GameArea from './GameArea';
import Menu from './Menu';
import Modal from './modal/Modal';
import Progress from './Progress';
import QrCode from './QrCode';
import ThemeText from './ThemeText';
import Timer from './Timer';
import TopPlayers from './TopPlayers';

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

interface LayoutProps {
  hit: boolean;
}

const Layout: React.FC<LayoutProps> = ({ hit }) => {
  return (
    <div
      className={classNames(
        styles.layout,
        nunitoSans.className,
        asapCondensed.className
      )}
    >
      <AnimatePresence>
        {hit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.hitOverlay}
          />
        )}
      </AnimatePresence>
      <header className={styles.header}>
        <div className={styles.headerLogoSection}></div>
        <div className={styles.headerContentSection}>
          <ThemeText />
          <Timer />
          <Progress />
          <Menu />
        </div>
      </header>
      <main className={styles.main}>
        <GameArea />
        <div className={styles.sidebar}>
          <TopPlayers />
          <QrCode />
        </div>
      </main>
      <Modal />
    </div>
  );
};

function mapStateToProps(state: LayoutProps): LayoutProps {
  return {
    hit: state.hit,
  };
}

export default withData(Layout, mapStateToProps);
