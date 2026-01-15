import { withData } from '@/lib/Context';
import styles from '@/styles/PlayerRow.module.css';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

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

        <AnimatePresence>
          {score.round && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              key='score'
            >
              <span className={classNames(styles.playerRound)}>
                {score.round}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
