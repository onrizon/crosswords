import { withData } from '@/lib/Context';
import styles from '@/styles/Layout.module.css';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Asap_Condensed, Nunito_Sans } from 'next/font/google';
import CameraPlaceholder from './CameraPlaceholder';
import GameArea from './GameArea';
import Menu from './Menu';
import Progress from './Progress';
import ThemeText from './ThemeText';
import Timer from './Timer';
import TopPlayers from './TopPlayers';
import Modal from './modal/Modal';

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
        <div className={styles.headerLogoSection}>
          <span />
        </div>

        <div className={styles.headerContentSection}>
          <ThemeText />
          <Timer />
          <Menu />
          <Progress />
        </div>
      </header>
      <main className={styles.main}>
        <GameArea />

        <div className={styles.sidebar}>
          <TopPlayers />
          <CameraPlaceholder />
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
