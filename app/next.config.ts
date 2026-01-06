import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ru', 'tr', 'vi', 'pl', 'ro', 'cs', 'nl', 'hr', 'el'],
    defaultLocale: 'pt',
    localeDetection: false,
  },
};

export default nextConfig;
