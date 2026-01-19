import { withData } from '@/lib/Context';
import styles from '@/styles/Layout.module.css';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Asap_Condensed, Nunito_Sans } from 'next/font/google';
import { useCallback, useEffect, useState } from 'react';
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

// Type definitions for browser-specific fullscreen APIs
interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
}

interface DocumentWithFullscreen extends Document {
  webkitExitFullscreen?: () => void;
  msExitFullscreen?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ hit }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to enter fullscreen
  const enterFullscreen = useCallback(() => {
    const element = document.body as HTMLElementWithFullscreen;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      /* Safari */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      /* IE11 */
      element.msRequestFullscreen();
    }
  }, []);

  // Function to exit fullscreen
  const exitFullscreen = useCallback(() => {
    const doc = document as DocumentWithFullscreen;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      /* Safari */
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      /* IE11 */
      doc.msExitFullscreen();
    }
  }, []);

  // Event listener for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check if the current element is the one in fullscreen mode
      setIsFullscreen(document.fullscreenElement === document.body);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // Include prefixed events for broader compatibility
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'msfullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

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
          <button onClick={toggleFullscreen}>
            {isFullscreen ? 'Exit Full Screen' : 'Go Full Screen'}
          </button>
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
