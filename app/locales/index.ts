import en from './en.json';
import pt from './pt.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';
import it from './it.json';
import ru from './ru.json';
import tr from './tr.json';
import vi from './vi.json';
import pl from './pl.json';
import ro from './ro.json';
import cs from './cs.json';
import nl from './nl.json';
import hr from './hr.json';
import el from './el.json';

export const locales = {
  en,
  pt,
  es,
  fr,
  de,
  it,
  ru,
  tr,
  vi,
  pl,
  ro,
  cs,
  nl,
  hr,
  el,
} as const;

export type Locale = keyof typeof locales;
export type TranslationKeys = keyof typeof en;
export type Translations = typeof en;

