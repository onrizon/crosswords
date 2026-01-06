import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/ThemeText.module.css';
import classNames from 'classnames';
import { Asap_Condensed } from 'next/font/google';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

export const ThemeText = ({
  className,
  currentTheme,
  isLoading,
}: {
  className: string;
  currentTheme: string;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const getThemeStyle = (text: string) => {
    const length = text.length;
    if (length > 20) return styles.textMedium;
    return styles.textLarge;
  };

  return (
    <div
      className={classNames(
        styles.container,
        asapCondensed.className,
        className
      )}
    >
      <div className={styles.titleContainer}>
        <h2 className={classNames(styles.title, getThemeStyle(currentTheme))}>
          {isLoading ? (
            <span className={styles.loading}>{t('generatingTheme')}</span>
          ) : (
            <>
              <span className={styles.label}>{t('theme')}</span>
              <span className={styles.theme}>{currentTheme}</span>
            </>
          )}
        </h2>
      </div>
      <span className={styles.find}>{t('findTheWords')}</span>
    </div>
  );
};
