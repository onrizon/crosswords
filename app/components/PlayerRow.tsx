import { withData } from '@/lib/Context';
import styles from '@/styles/PlayerRow.module.css';
import classNames from 'classnames';
import { useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface PlayerRowProps {
  user: string;
  score: { round: number; total: number };
  index: number;
  hit: boolean;
}

const PlayerRow: React.FC<PlayerRowProps> = ({ user, score, index, hit }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const getRankClass = (index: number) => {
    if (index === 0) return `${styles.playerRank} ${styles.playerRankGold}`;
    if (index === 1) return `${styles.playerRank} ${styles.playerRankSilver}`;
    if (index === 2) return `${styles.playerRank} ${styles.playerRankBronze}`;
    return `${styles.playerRank} ${styles.playerRankDefault}`;
  };

  return (
    <div
      key={user}
      className={classNames(styles.playerRow, {
        [styles.playerRowActive]: hit,
      })}
    >
      <div className={styles.playerInfo}>
        <div className={getRankClass(index)}>{index + 1}</div>
        <span className={styles.playerName}>{user}</span>
        <TransitionGroup component={null}>
          <CSSTransition
            key={score.round}
            nodeRef={nodeRef}
            classNames={{
              enter: styles['fade-enter'],
              enterActive: styles['fade-enter-active'],
              enterDone: styles['fade-enter-done'],
              exit: styles['fade-exit'],
              exitActive: styles['fade-exit-active'],
            }}
            timeout={3000}
          >
            <span
              ref={nodeRef}
              className={classNames(styles.playerRound, {
                [styles.playerRoundHidden]: !score.round,
              })}
            >
              {score.round}
            </span>
          </CSSTransition>
        </TransitionGroup>

        <span className={styles.playerTotal}>{score.total}</span>
      </div>
    </div>
  );
};

function mapStateToProps(state: { hit: boolean }): { hit: boolean } {
  return {
    hit: state.hit,
  };
}

export default withData(PlayerRow, mapStateToProps);
