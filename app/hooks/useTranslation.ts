import { Locale, locales, TranslationKeys, Translations } from '@/locales';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

export function useTranslation() {
  const router = useRouter();
  const locale = (router.locale || 'pt') as Locale;

  // Get all translations for the current locale
  const translations: Translations = useMemo(() => {
    return locales[locale] || locales.en;
  }, [locale]);

  // Function to get a single translation by key
  const t = useCallback(
    (key: TranslationKeys): string => {
      return translations[key] || locales.en[key] || key;
    },
    [translations]
  );

  // Function to change locale
  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (router.locale === newLocale) return;

      const { pathname, asPath, query } = router;
      router.replace({ pathname, query }, asPath, { locale: newLocale });
    },
    [router]
  );

  return {
    t,
    locale,
    translations,
    changeLocale,
    locales: Object.keys(locales) as Locale[],
  };
}

// Locale display names for UI
export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
};
