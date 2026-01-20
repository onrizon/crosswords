import styles from '@/styles/Menu.module.css';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

// Type definitions for browser-specific fullscreen APIs
interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => void;
  msRequestFullscreen?: () => void;
}

interface DocumentWithFullscreen extends Document {
  webkitExitFullscreen?: () => void;
  msExitFullscreen?: () => void;
}

const Menu: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSound, setIsSound] = useState(false);

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

  useEffect(() => {
    setTimeout(() => setIsSound(typeof window !== 'undefined' && localStorage.getItem('streamCrossSound') === '1'), 0);
  }, []);

  const toggleSound = () => {
    if (isSound) {
      localStorage.removeItem('streamCrossSound');
    } else {
      localStorage.setItem('streamCrossSound', '1');
    }
    setIsSound(!isSound);
  };

  return (
    <div className={styles.container}>
      <button
        onClick={toggleFullscreen}
        className={classNames(styles.button, styles.btnFullscreen, {
          [styles.active]: isFullscreen,
        })}
        title="Fullscreen"
      >
        <span />
      </button>
      <button
        onClick={toggleSound}
        className={classNames(styles.button, styles.btnSound, {
          [styles.active]: isSound,
        })}
        title="Sound On/Off"
      >
        <span />
      </button>
    </div>
  );
};


export default Menu;
