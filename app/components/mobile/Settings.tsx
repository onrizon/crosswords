import exit from '@/public/lotties/exit.json';
import styles from '@/styles/mobile/Settings.module.css';
import { useContext, useState } from 'react';

import { Select } from '@/components/system/common/Select';
import { localeNames, useTranslation } from '@/hooks/useTranslation';
import { ModalContext, withData } from '@/lib/Context';
import { ModalContextProps } from '@/types/modalTypes';
import { Player } from '@/types/types';
import classNames from 'classnames';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { Socket } from 'socket.io-client';

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

interface SettingsProps {
  isOwner: boolean;
  socket: Socket;
  roomCode: string;
  players: Player[];
  duration: number;
  language: string;
  endMode: number;
  endTarget: number;
}

const Settings: React.FC<SettingsProps> = ({
  isOwner, socket, roomCode, players, duration, language, endMode, endTarget,
}) => {
  const router = useRouter();
  const setModal = useContext(ModalContext) as ModalContextProps["setModal"];
  const { t, locales } = useTranslation();
  const [activeTab, setActiveTab] = useState(false);
  const playerName = typeof window !== 'undefined' ? sessionStorage.getItem('playerName') || '' : '';

  function emitSettings(updates: Record<string, unknown>) {
    if (!socket || !isOwner) return;
    socket.emit('game:updateSettings', { roomCode, ...updates });
  }

  function handleStart() {
    if (!socket || !isOwner) return;
    socket.emit('game:start', { roomCode });
  }

  function handleLeave() {
    if (!socket) return;
    socket.emit('room:leave', { roomCode });
    sessionStorage.removeItem('roomCode');
    sessionStorage.removeItem('playerId');
    router.push('/mobile');
  }

  return <div className={classNames(styles.fullContainer, { [styles.active]: activeTab })}>
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.logout} onClick={() => {
          setModal({
            title: 'Sair',
            lottie: exit,
            description: 'Deseja realmente sair da sala?',
            button: () => handleLeave(),
          });
        }} />
        <div className={styles.headerTitle}>
          <h2>{playerName}</h2>
          {isOwner && (<h4>
            <span className={classNames(styles.icon, styles.iconHost)} />
            Você é o host
          </h4>
          )}
        </div>
        <button className={styles.language} onClick={() => setActiveTab(true)} />
      </div>
      <div className={styles.content}>
        <div className={styles.users}>
          <div className={styles.icon} />
          {players.length} pessoa{players.length !== 1 ? 's' : ''} na sala
        </div>
        <div className={styles.box}>
          <h4>
            <span className={classNames(styles.icon, styles.iconTime)} />
            Tempo da rodada
          </h4>
          <Select
            disabled={!isOwner}
            small={true}
            value={duration}
            onChange={(e) => emitSettings({ duration: parseInt(e.target.value) })}
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
            value={endMode}
            onChange={(e) => {
              const mode = parseInt(e.target.value);
              const defaultTarget = mode === 2 ? 3 : mode === 3 ? 10 : 0;
              emitSettings({ endMode: mode, endTarget: defaultTarget });
            }}
            options={[
              { value: 1, label: 'Infinito (subathon)' },
              { value: 2, label: 'Meta de rodadas' },
              { value: 3, label: 'Meta de pontos' },
            ]}
          />
        </div>

        {endMode === 2 && (
          <div className={styles.box}>
            <h4>
              <span className={classNames(styles.icon, styles.iconTarget)} />
              Meta
            </h4>
            <Select
              disabled={!isOwner}
              small={true}
              value={endTarget}
              onChange={(e) => emitSettings({ endTarget: parseInt(e.target.value) })}
              options={[
                { value: 1, label: '1 rodada' },
                { value: 2, label: '2 rodadas' },
                { value: 3, label: '3 rodadas' },
                { value: 4, label: '4 rodadas' },
                { value: 5, label: '5 rodadas' },
              ]}
            />
          </div>
        )}

        {endMode === 3 && (
          <div className={styles.box}>
            <h4>
              <span className={classNames(styles.icon, styles.iconTarget)} />
              Meta
            </h4>
            <Select
              disabled={!isOwner}
              small={true}
              value={endTarget}
              onChange={(e) => emitSettings({ endTarget: parseInt(e.target.value) })}
              options={[
                { value: 2, label: '2 pontos' },
                { value: 10, label: '10 pontos' },
                { value: 15, label: '15 pontos' },
                { value: 20, label: '20 pontos' },
                { value: 30, label: '30 pontos' },
              ]}
            />
          </div>
        )}
      </div>
      <div className={styles.footer}>
        {isOwner ?
          <button
            onClick={handleStart}
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
          {locales.map((loc) => (
            <li key={loc}>
              <button onClick={() => emitSettings({ language: loc })} className={classNames({ [styles.active]: loc === language })}>
                {localeNames[loc]}
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

function mapStateToProps(state: SettingsProps): SettingsProps {
  return {
    isOwner: state.isOwner,
    socket: state.socket,
    roomCode: state.roomCode,
    players: state.players,
    duration: state.duration,
    language: state.language,
    endMode: state.endMode,
    endTarget: state.endTarget,
  };
}

export default withData(Settings, mapStateToProps);
