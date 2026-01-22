import styles from '@/styles/Menu.module.css';
import FullscreenButton from '../common/FullscreenButton';
import SoundButton from '../common/SoundButton';

const Menu: React.FC = () => {
  return (
    <div className={styles.container}>
      <FullscreenButton />
      <SoundButton />
    </div>
  );
};


export default Menu;
