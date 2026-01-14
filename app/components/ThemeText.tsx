import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/ThemeText.module.css';
import classNames from 'classnames';
import { createRef, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface ThemeTextProps {
  currentClue: string;
  currentClueIndex: number;
  totalClues: number;
  hit: boolean;
  isLoading: boolean;
  lastHitInfo: { username: string; word: string; index: number } | null;
}

const ThemeText: React.FC<ThemeTextProps> = ({
  currentClue,
  currentClueIndex,
  totalClues,
  hit,
  isLoading,
  lastHitInfo,
}) => {
  const transitionKey = isLoading
    ? 'loading'
    : lastHitInfo
    ? `hit-${lastHitInfo.username}-${lastHitInfo.word}`
    : `clue-${currentClue}`;
  const nodeRef = useMemo(() => createRef<HTMLDivElement>(), [transitionKey]);
  const { t } = useTranslation();
  const getThemeStyle = (text: string) => {
    const length = text.length;
    if (length > 20) return styles.textMedium;
    return styles.textLarge;
  };

  return (
    <div className={styles.container}>
      <TransitionGroup component={null}>
        <CSSTransition
          key={transitionKey}
          nodeRef={nodeRef}
          classNames={{
            enter: styles['fade-enter'],
            enterActive: styles['fade-enter-active'],
            exit: styles['fade-exit'],
            exitActive: styles['fade-exit-active'],
          }}
          timeout={250}
        >
          <div ref={nodeRef}>
            {hit && (
              <>
                <div
                  className={classNames(styles.hitTheme, styles.hitThemeLeft)}
                />
                <div
                  className={classNames(styles.hitTheme, styles.hitThemeRight)}
                />
              </>
            )}

            <div className={styles.titleContainer}>
              <div
                className={classNames(
                  styles.title,
                  getThemeStyle(currentClue)
                )}
              >
                {isLoading && (
                  <div className={styles.text}>
                    <span className={styles.loading}>
                      {t('generatingClue')}
                    </span>
                  </div>
                )}

                {!isLoading && !lastHitInfo?.word && (
                  <div className={styles.text}>
                    <span className={styles.label}>
                      {t('clue')} ({currentClueIndex + 1})
                    </span>
                    <span className={styles.clue}>{currentClue}</span>
                  </div>
                )}

                {lastHitInfo?.word && (
                  <div className={styles.text}>
                    <span className={styles.who}>
                      <b>{lastHitInfo.username}</b> ACERTOU
                    </span>
                    <span className={styles.word}>
                      {lastHitInfo.index}.<b>{lastHitInfo.word}</b>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CSSTransition>
      </TransitionGroup>
      <span className={styles.find}>{t('findTheWords')}</span>
    </div>
  );
};

function mapStateToProps(state: ThemeTextProps): ThemeTextProps {
  return {
    currentClue: state.currentClue,
    currentClueIndex: state.currentClueIndex,
    totalClues: state.totalClues,
    hit: state.hit,
    isLoading: state.isLoading,
    lastHitInfo: state.lastHitInfo || null,
  };
}

export default withData(ThemeText, mapStateToProps);
