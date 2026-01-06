import en from './en.json';
import pt from './pt.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';
import it from './it.json';

export const locales = {
  en,
  pt,
  es,
  fr,
  de,
  it,
} as const;

export type Locale = keyof typeof locales;
export type TranslationKeys = keyof typeof en;
export type Translations = typeof en;

