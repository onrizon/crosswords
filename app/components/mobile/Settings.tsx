import styles from '@/styles/mobile/Settings.module.css';
import { useState } from 'react';

import { Select } from '@/components/system/common/Select';
import { useAuth } from '@/hooks/useAuth';
import { localeNames, useTranslation } from '@/hooks/useTranslation';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import localFont from 'next/font/local';

const asapCondensed = localFont({
  src: [
    { path: '../../_assets/fonts/AsapCondensed-Medium.ttf', weight: '500' },
    { path: '../../_assets/fonts/AsapCondensed-SemiBold.ttf', weight: '600' },
    { path: '../../_assets/fonts/AsapCondensed-Bold.ttf', weight: '700' },
    { path: '../../_assets/fonts/AsapCondensed-ExtraBold.ttf', weight: '800' },
    { path: '../../_assets/fonts/AsapCondensed-Black.ttf', weight: '900' },
  ],
  variable: '--asap-condensed',
});

const nunito = localFont({
  src: [
    { path: '../../_assets/fonts/Nunito-Medium.ttf', weight: '500' },
    { path: '../../_assets/fonts/Nunito-SemiBold.ttf', weight: '600' },
    { path: '../../_assets/fonts/Nunito-Bold.ttf', weight: '700' },
    { path: '../../_assets/fonts/Nunito-ExtraBold.ttf', weight: '800' },
    { path: '../../_assets/fonts/Nunito-Black.ttf', weight: '900' },
  ],
  variable: '--nunito',
});

export default function Settings() {
  const { data: session } = useSession();
  const { logout } = useAuth();
  const { t, locales } = useTranslation();
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState(false);
  // const { changeLocale } = useTranslation();


  return <div className={classNames(styles.fullContainer, { [styles.active]: activeTab })}>
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.logout} onClick={() => logout()} />
        <div className={styles.headerTitle}>
          <h2>{session?.user.name}</h2>
          {isOwner && (<h4>
            <span className={classNames(styles.icon, styles.iconHost)} />
            Você é o host
          </h4>
          )}
        </div>
        <button className={styles.language} onClick={() => setActiveTab(true)} />
      </div>
      <div className={styles.content}>
        <div className={styles.box}>
          <h4>
            <span className={classNames(styles.icon, styles.iconTime)} />
            Tempo da rodada
          </h4>
          <Select
            disabled={!isOwner}
            small={true}
            value={120}
            onChange={() => { }}
            options={[
              { value: 30, label: `30 ${t('seconds')}` },
              { value: 60, label: `1 ${t('minute')}` },
              {
                value: 90,
                label: `1 ${t('minute')} ${t('and')} 30 ${t('seconds')}`,
              },
              { value: 120, label: `2 ${t('minutes')}` },
              {
                value: 150,
                label: `2 ${t('minutes')} ${t('and')} 30 ${t('seconds')}`,
              },
              { value: 180, label: `3 ${t('minutes')}` },
              {
                value: 210,
                label: `3 ${t('minutes')} ${t('and')} 30 ${t('seconds')}`,
              },
              { value: 240, label: `4 ${t('minutes')}` },
              {
                value: 270,
                label: `4 ${t('minutes')} ${t('and')} 30 ${t('seconds')}`,
              },
              { value: 300, label: `5 ${t('minutes')}` },
            ]}
          />
        </div>

        <div className={styles.box}>
          <h4>
            <span className={classNames(styles.icon, styles.iconGameOver)} />
            Fim de jogo
          </h4>
          <Select
            disabled={!isOwner}
            small={true}
            value={1}
            onChange={() => { }}
            options={[
              { value: 1, label: 'Infinito (subathon)' },
              { value: 2, label: 'Meta de rodadas' },
              { value: 3, label: 'Meta de pontos' },
            ]}
          />
        </div>

        <div className={styles.box}>
          <h4>
            <span className={classNames(styles.icon, styles.iconTarget)} />
            Meta
          </h4>
          <Select
            disabled={!isOwner}
            small={true}
            value={200}
            onChange={() => { }}
            options={[
              { value: 100, label: '100 pontos' },
              { value: 200, label: '200 pontos' },
              { value: 300, label: '300 pontos' },
              { value: 400, label: '400 pontos' },
              { value: 500, label: '500 pontos' },
            ]}
          />
        </div>
      </div>
      <div className={styles.footer}>
        {isOwner ?
          <button
            onClick={() => { }}
            className={styles.btn}
          >
            Iniciar
          </button>
          :
          <p className={styles.notOwner}>O host está configurando a partida </p>
        }
      </div>
    </div>
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => setActiveTab(false)} />
        <div className={styles.headerTitle}>
          <h2>IDIOMA</h2>
        </div>
      </div>
      <div className={styles.content}>
        <ul>
          {locales.map((locale) => (
            <li key={locale}>
              <button onClick={() => { }} className={classNames({ [styles.active]: locale === 'pt' })}>
                {localeNames[locale]}
                <span className={classNames(styles.icon, styles.iconCheck)} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <style jsx global>{`
        :root {
          --asap-condensed: ${asapCondensed.style.fontFamily};
          --nunito: ${nunito.style.fontFamily};
        }
      `}</style>
  </div>;
}