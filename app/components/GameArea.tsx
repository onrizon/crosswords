import { withData } from '@/lib/Context';
import styles from '@/styles/GameArea.module.css';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Grid from './Grid';
import { Loading } from './Loading';

interface GameAreaProps {
  hit: boolean;
  isLoading: boolean;
}

const GameArea: React.FC<GameAreaProps> = ({ hit, isLoading }) => {
  return (
    <div className={styles.gameArea}>
      <div className={styles.gridContainer}>
        <div className={styles.gridLightLeft} />
        <div className={styles.gridLightRight} />
        <AnimatePresence>
          {hit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key='hitLight'
            >
              <div
                className={classNames(
                  styles.gridLightLeft,
                  styles.gridLightLeftActive
                )}
              />
              <div
                className={classNames(
                  styles.gridLightRight,
                  styles.gridLightRightActive
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
