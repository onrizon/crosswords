import styles from '@/styles/Menu.module.css';
import classNames from 'classnames';
import { useState } from 'react';

const Menu: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
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
          [styles.active]: !isSoundOn,
        })}
        title="Sound On/Off"
      >
        <span />
      </button>
    </div>
  );
};

export default Menu;
