import { withData } from '@/lib/Context';
import styles from '@/styles/GameArea.module.css';
import classNames from 'classnames';
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
        <div
          className={classNames(styles.gridLightLeft, {
            [styles.gridLightLeftActive]: hit,
          })}
        ></div>
        <div
          className={classNames(styles.gridLightRight, {
            [styles.gridLightRightActive]: hit,
          })}
        ></div>

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
