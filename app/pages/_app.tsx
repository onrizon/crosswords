import '@/styles/Globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta charSet='utf-8' />
        <meta name="viewport" content="width=device-width, user-scalable=no, interactive-widget=resizes-content" />
        <meta name='theme-color' content='#3b20d6' />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
