import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'pt', 'es', 'fr', 'de', 'it'],
    defaultLocale: 'pt',
    localeDetection: false,
  },
};

export default nextConfig;
