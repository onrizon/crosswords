import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/ThemeText.module.css';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

interface ThemeTextProps {
  currentTheme: string;
  hit: boolean;
  isLoading: boolean;
  lastHitInfo: { username: string; word: string; index: number } | null;
}

const ThemeText: React.FC<ThemeTextProps> = ({
  currentTheme,
  hit,
  isLoading,
  lastHitInfo,
}) => {
  const { t } = useTranslation();
  const getThemeStyle = (text: string) => {
    const length = text.length;
    if (length > 20) return styles.textMedium;
    return styles.textLarge;
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {hit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key='hitLight'
          >
            <div className={classNames(styles.hitTheme, styles.hitThemeLeft)} />
            <div
              className={classNames(styles.hitTheme, styles.hitThemeRight)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.titleContainer}>
        <div className={classNames(styles.title, getThemeStyle(currentTheme))}>
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                key='loading'
                className={styles.text}
              >
                <span className={styles.loading}>{t('generatingTheme')}</span>
              </motion.div>
            )}

            {!isLoading && !lastHitInfo?.word && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                key='theme'
                className={styles.text}
              >
                <span className={styles.label}>{t('theme')}</span>
                <span className={styles.theme}>{currentTheme}</span>
              </motion.div>
            )}

            {lastHitInfo?.word && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                key='hit'
                className={styles.text}
              >
                <span className={styles.who}>
                  <b>{lastHitInfo.username}</b> ACERTOU
                </span>
                <span className={styles.word}>
                  {lastHitInfo.index}.<b>{lastHitInfo.word}</b>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <span className={styles.find}>{t('findTheWords')}</span>
    </div>
  );
};

function mapStateToProps(state: ThemeTextProps): ThemeTextProps {
  return {
    currentTheme: state.currentTheme,
    hit: state.hit,
    isLoading: state.isLoading,
    lastHitInfo: state.lastHitInfo || null,
  };
}

export default withData(ThemeText, mapStateToProps);
