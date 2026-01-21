import styles from '@/styles/Menu.module.css';
import FullscreenButton from './FullscreenButton';
import SoundButton from './SoundButton';

const Menu: React.FC = () => {
  return (
    <div className={styles.container}>
      <FullscreenButton />
      <SoundButton />
    </div>
  );
};


export default Menu;
