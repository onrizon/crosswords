import { withData } from '@/lib/Context';
import styles from '@/styles/GameArea.module.css';
import classNames from 'classnames';
import { useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Grid from './Grid';
import { Loading } from './Loading';

interface GameAreaProps {
  hit: boolean;
  isLoading: boolean;
}

const GameArea: React.FC<GameAreaProps> = ({ hit, isLoading }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.gameArea}>
      <div className={styles.gridContainer}>
        <div className={styles.gridLightLeft} />
        <div className={styles.gridLightRight} />

        <TransitionGroup component={null}>
          {hit && (
            <CSSTransition
              key={'hit'}
              nodeRef={nodeRef}
              classNames={{
                enter: styles['fade-enter'],
                enterActive: styles['fade-enter-active'],
                exit: styles['fade-exit'],
                exitActive: styles['fade-exit-active'],
              }}
              timeout={250}
            >
              <>
                <div
                  ref={nodeRef}
                  className={classNames(
                    styles.gridLightLeft,
                    styles.gridLightLeftActive
                  )}
                />
                <div
                  ref={nodeRef}
                  className={classNames(
                    styles.gridLightRight,
                    styles.gridLightRightActive
                  )}
                />
              </>
            </CSSTransition>
          )}
        </TransitionGroup>

        {isLoading && <Loading />}

        <div
          className={classNames(styles.gridScrollContainer, 'custom-scrollbar')}
        >
          <Grid />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: GameAreaProps): GameAreaProps {
  return {
    hit: state.hit,
    isLoading: state.isLoading,
  };
}

export default withData(GameArea, mapStateToProps);
