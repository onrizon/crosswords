import styles from '@/styles/Button.module.css';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

const SoundButton: React.FC = () => {
  const [isSound, setIsSound] = useState(false);

  const toggleSound = () => {
    if (isSound) {
      localStorage.removeItem('streamCrossSound');
    } else {
      localStorage.setItem('streamCrossSound', '1');
    }
    setIsSound(!isSound);
  };

  useEffect(() => {
    setTimeout(() => setIsSound(typeof window !== 'undefined' && localStorage.getItem('streamCrossSound') === '1'), 0);
  }, []);

  return (
    <button
      onClick={toggleSound}
      className={classNames(styles.button, styles.btnSound, {
        [styles.active]: isSound,
      })}
      title="Sound On/Off"
    >
      <span />
    </button>
  );
};

export default SoundButton;