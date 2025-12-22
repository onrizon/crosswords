import styles from '@/styles/TopPlayers.module.css';
import { UserScores } from '@/types';
import { Crown, Trophy } from 'lucide-react';

export const TopPlayers = ({
  userScores,
  t,
}: {
  userScores: UserScores;
  t: { topPlayers: string; beFirst: string };
}) => {
  const topScorers = Object.entries(userScores).sort(
    ([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number)
  );

  const getRankClass = (index: number) => {
    if (index === 0) return `${styles.playerRank} ${styles.playerRankGold}`;
    if (index === 1) return `${styles.playerRank} ${styles.playerRankSilver}`;
    if (index === 2) return `${styles.playerRank} ${styles.playerRankBronze}`;
    return `${styles.playerRank} ${styles.playerRankDefault}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Trophy size={24} className={styles.icon} />
        <h3 className={styles.title}>{t.topPlayers}</h3>
      </div>
      <div className={`${styles.list} custom-scrollbar`}>
        {topScorers.length === 0 ? (
          <div className={styles.empty}>{t.beFirst}</div>
        ) : (
          topScorers.map(([user, score], index) => (
            <div key={user} className={styles.playerRow}>
              <div className={styles.playerInfo}>
                <div className={getRankClass(index)}>{index + 1}</div>
                <span
                  className={`${styles.playerName} ${
                    index === 0 ? styles.playerNameGold : ''
                  }`}
                >
                  {user}{' '}
                  {index === 0 && (
                    <Crown size={16} className={styles.playerCrown} />
                  )}
                </span>
              </div>
              <span className={styles.playerScore}>{score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
