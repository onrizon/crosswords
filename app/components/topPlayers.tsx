import styles from '@/styles/TopPlayers.module.css';
import { UserScores } from '@/types';
import classNames from 'classnames';

import { Nunito_Sans } from 'next/font/google';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-nunito-sans',
});

export const TopPlayers = ({
  userScores,
  t,
}: {
  userScores: UserScores;
  t: { topPlayers: string; beFirst: string };
}) => {
  // const mockUserScores: Record<string, number> = {
  //   aliceasdasdasdasdasdasdasd: 999999,
  //   aliceasdasdasdasdasdasdasb: 999999,
  //   aliceasdasdasdasdasdasdasw: 999999,
  //   aliceasdasdasdasdasdasdasq: 999999,
  //   eve: 200,
  //   frank: 100,
  //   grace: 50,
  //   hank: 25,
  //   ivy: 10,
  //   jack: 5,
  //   jack1: 5,
  //   jack2: 5,
  //   jack3: 5,
  //   jack4: 5,
  //   jack5: 5,
  // };

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
    <div className={classNames(styles.container, nunitoSans.className)}>
      <div className={styles.containerEdge}>
        <div className={styles.header}>
          <div className={styles.icon} />
          <h3 className={styles.title}>{t.topPlayers}</h3>
        </div>
        <div className={classNames(styles.list, 'custom-scrollbar')}>
          {topScorers.length === 0 ? (
            <div className={styles.empty}>{t.beFirst}</div>
          ) : (
            topScorers.map(([user, score], index) => (
              <div key={user} className={styles.playerRow}>
                <div className={styles.playerInfo}>
                  <div className={getRankClass(index)}>{index + 1}</div>
                  <span
                    className={classNames(styles.playerName, {
                      [styles.playerNameGold]: index === 0,
                    })}
                  >
                    {user}
                  </span>
                  <span className={styles.playerScore}>{score}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
