import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/TopPlayers.module.css';
import { UserScores } from '@/types';
import classNames from 'classnames';
import PlayerRow from './PlayerRow';

interface TopPlayersProps {
  userScores: UserScores;
}

const TopPlayers: React.FC<TopPlayersProps> = ({
  userScores,
}) => {
  const { t } = useTranslation();

  const topScorers = Object.entries(userScores).sort(
    ([, scoreA], [, scoreB]) =>
      (scoreB.total as number) - (scoreA.total as number)
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerEdge}>
        <div className={styles.header}>
          <div className={styles.icon} />
          <h3 className={styles.title}>
            {t('ranking')}
          </h3>
        </div>
        <div className={classNames(styles.list, 'custom-scrollbar')}>
          {topScorers.length === 0 ? (
            <div className={styles.empty}>
              <span />
              {t('beFirstToScore')}
            </div>
          ) : (
            topScorers.map(([user, score], index) => (
              <PlayerRow key={user} user={user} score={score} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: TopPlayersProps): TopPlayersProps {
  return {
    userScores: state.userScores,
  };
}

export default withData(TopPlayers, mapStateToProps);
