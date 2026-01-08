import styles from '@/styles/Layout.module.css';
import CameraPlaceholder from './CameraPlaceholder';
import GameArea from './GameArea';
import Menu from './Menu';
import Progress from './Progress';
import ThemeText from './ThemeText';
import Timer from './Timer';
import TopPlayers from './TopPlayers';
import Modal from './modal/Modal';

const Layout: React.FC = () => {
  return (
    <>
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
          <CameraPlaceholder />
          <TopPlayers />
        </div>
      </main>

      <Modal />
    </>
  );
};

export default Layout;
