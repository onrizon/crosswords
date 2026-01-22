import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import id from './id.json';
import it from './it.json';
import nl from './nl.json';
import pt from './pt.json';

export const locales = {
  de, en, es, fr, it, nl, pt, id
} as const;

export type Locale = keyof typeof locales;
export type TranslationKeys = keyof typeof en;
export type Translations = typeof en;

