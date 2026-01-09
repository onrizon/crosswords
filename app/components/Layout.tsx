import { withData } from '@/lib/Context';
import styles from '@/styles/Layout.module.css';
import { useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CameraPlaceholder from './CameraPlaceholder';
import GameArea from './GameArea';
import Menu from './Menu';
import Progress from './Progress';
import ThemeText from './ThemeText';
import Timer from './Timer';
import TopPlayers from './TopPlayers';
import Modal from './modal/Modal';

const Layout: React.FC<{ hit: boolean }> = ({ hit }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <TransitionGroup component={null}>
        {hit && (
          <CSSTransition
            key={'hit'}
            nodeRef={nodeRef}
            classNames='borderHit'
            timeout={{
              enter: 900,
              exit: 300,
            }}
          >
            <div ref={nodeRef} className={styles.hitOverlay} />
          </CSSTransition>
        )}
      </TransitionGroup>
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

function mapStateToProps(state: { hit: boolean }): {
  hit: boolean;
} {
  return {
    hit: state.hit,
  };
}

export default withData(Layout, mapStateToProps);
