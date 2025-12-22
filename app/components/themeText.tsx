import styles from '@/styles/ThemeText.module.css';
import { Asap_Condensed } from 'next/font/google';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

export const ThemeText = ({
  currentTheme,
  isLoading,
  language,
  t,
}: {
  currentTheme: string;
  isLoading: boolean;
  language: string;
  t: string;
}) => {
  const getThemeStyle = (text: string) => {
    const length = text.length;
    if (length > 35) return styles.textSmall;
    if (length > 20) return styles.textMedium;
    return styles.textLarge;
  };

  return (
    <div className={styles.container}>
      <div className={styles.gradientOverlay} />
      <span className={styles.label}>
        {language === 'pt' ? 'TEMA ATUAL' : 'CURRENT THEME'}
      </span>
      <div className={styles.titleContainer}>
        <h2
          className={`${styles.title} ${getThemeStyle(currentTheme)} ${
            asapCondensed.className
          }`}
        >
          {isLoading ? (
            <span className={styles.loading}>{t}</span>
          ) : (
            currentTheme
          )}
        </h2>
      </div>
    </div>
  );
};
