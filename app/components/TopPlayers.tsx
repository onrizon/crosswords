import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/TopPlayers.module.css';
import { UserScores } from '@/types';
import classNames from 'classnames';

import { Nunito_Sans } from 'next/font/google';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-nunito-sans',
});

const TopPlayers: React.FC<{
  userScores: UserScores;
  showCameraArea: boolean;
}> = ({
  userScores,
  showCameraArea,
}: {
  userScores: UserScores;
  showCameraArea: boolean;
}) => {
  const { t } = useTranslation();

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
    <div
      className={classNames(styles.container, nunitoSans.className, {
        [styles.fullHeight]: !showCameraArea,
      })}
    >
      <div className={styles.containerEdge}>
        <div className={styles.header}>
          <div className={styles.icon} />
          <h3 className={styles.title}>{t('ranking')}</h3>
        </div>
        <div className={classNames(styles.list, 'custom-scrollbar')}>
          {topScorers.length === 0 ? (
            <div className={styles.empty}>
              <span />
              {t('beFirstToScore')}
            </div>
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

function mapStateToProps(state: {
  userScores: UserScores;
  showCameraArea: boolean;
}): {
  userScores: UserScores;
  showCameraArea: boolean;
} {
  return {
    userScores: state.userScores,
    showCameraArea: state.showCameraArea,
  };
}

export default withData(TopPlayers, mapStateToProps);
