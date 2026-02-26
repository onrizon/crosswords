import ModalWrapper from '@/components/mobile/ModalWrapper';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { ModalContext } from '@/lib/Context';
import nick from '@/public/lotties/nick.json';
import styles from '@/styles/mobile/Join.module.css';
import { ModalContextProps } from '@/types/modalTypes';
import { RoomState } from '@/types/types';
import classNames from 'classnames';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';

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

function Join() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const { isAuthenticated, user, loginWithTwitch, loginWithDiscord } = useAuth();
  const setModal = useContext(ModalContext) as ModalContextProps["setModal"];
  const [nickname, setNickname] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [roomInfo, setRoomInfo] = useState<{
    ownerName: string;
    authMode: 'anonymous' | 'twitch' | 'discord';
    playerCount: number;
  } | null>(null);
  const autoJoinedRef = useRef(false);

  const roomCode = (router.query.room as string) || '';
  const authMode = roomInfo?.authMode || 'anonymous';

  // Restore nickname from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('playerName');
    if (stored) setNickname(stored);
  }, []);

  // Fetch room info to know authMode
  useEffect(() => {
    if (!socket || !isConnected || !roomCode) return;

    socket.emit('room:getInfo', { roomCode: roomCode.toUpperCase() });

    function onInfo(info: { code: string; ownerName: string; authMode: 'anonymous' | 'twitch' | 'discord'; playerCount: number }) {
      setRoomInfo(info);
    }

    socket.on('room:info', onInfo);
    return () => { socket.off('room:info', onInfo); };
  }, [socket, isConnected, roomCode]);

  // After OAuth redirect: if user is authenticated and room requires that provider, auto-join
  useEffect(() => {
    if (!isAuthenticated || !user || !socket || !isConnected || !roomCode || !roomInfo || autoJoinedRef.current) return;
    if (authMode === 'anonymous') return; // don't auto-join anonymous rooms after OAuth

    const provider = user.twitchLogin ? 'twitch' : user.discordUsername ? 'discord' : null;
    if (provider !== authMode) return; // wrong provider

    autoJoinedRef.current = true;
    const playerName = user.twitchLogin || user.discordUsername || user.name || 'Player';
    setIsJoining(true);
    socket.emit('room:join', {
      roomCode: roomCode.toUpperCase(),
      playerName,
      provider,
    });
  }, [isAuthenticated, user, socket, isConnected, roomCode, roomInfo, authMode]);

  // Listen for join/error
  useEffect(() => {
    if (!socket) return;

    function onJoined({ roomState, playerId }: { roomState: RoomState; playerId: string }) {
      const name = user?.twitchLogin || user?.discordUsername || user?.name || nickname;
      sessionStorage.setItem('roomCode', roomCode);
      sessionStorage.setItem('playerId', playerId);
      sessionStorage.setItem('playerName', name);
      router.push(`/mobile/system?room=${roomCode}`);
    }

    function onError({ message }: { message: string }) {
      setIsJoining(false);
      autoJoinedRef.current = false;
      setModal({
        title: 'Erro',
        lottie: nick,
        description: message,
      });
    }

    socket.on('room:joined', onJoined);
    socket.on('room:error', onError);

    return () => {
      socket.off('room:joined', onJoined);
      socket.off('room:error', onError);
    };
  }, [socket, roomCode, nickname, user, router, setModal]);

  function handleEnterNickname() {
    if (!nickname.trim()) {
      setModal({
        title: 'Nome Inválido',
        lottie: nick,
        description: 'Digite um apelido válido',
      });
      return;
    }
    if (!roomCode || !isConnected) return;

    setIsJoining(true);
    socket.emit('room:join', {
      roomCode: roomCode.toUpperCase(),
      playerName: nickname.trim(),
    });
  }

  const oauthCallback = `/mobile/join?room=${roomCode}`;

  return (
    <div className={styles.container}>
      <div className={styles.logo}></div>
      <div className={styles.content}>
        <h2>ENTRAR NA SALA</h2>
        <div className={styles.box}>
          <div className={styles.owner}>
            <h4>sala de:</h4>
            <h3>{roomInfo?.ownerName || roomCode || '...'}</h3>
          </div>

          {/* Anonymous room: show nickname input */}
          {authMode === 'anonymous' && (
            <div className={styles.nickname}>
              <h4>
                <div className={styles.icon} />
                Seu nickname
              </h4>
              <input
                className={styles.input}
                type="text"
                placeholder="Player2234"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEnterNickname()}
              />
              <button
                onClick={handleEnterNickname}
                disabled={isJoining || !isConnected}
                className={classNames(styles.btn, styles.btnPrimary)}
              >
                {isJoining ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          )}

          {/* Twitch room: show Twitch login button */}
          {authMode === 'twitch' && (
            <button
              onClick={() => loginWithTwitch(oauthCallback)}
              disabled={isJoining}
              className={classNames(styles.btn, styles.btnSecondary, styles.twitch)}
            >
              <div className={styles.icon} />
              {isJoining ? 'Entrando...' : 'Entrar com Twitch'}
            </button>
          )}

          {/* Discord room: show Discord login button */}
          {authMode === 'discord' && (
            <button
              onClick={() => loginWithDiscord(oauthCallback)}
              disabled={isJoining}
              className={classNames(styles.btn, styles.btnSecondary, styles.discord)}
            >
              <div className={styles.icon} />
              {isJoining ? 'Entrando...' : 'Entrar com Discord'}
            </button>
          )}

          {!isConnected && (
            <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', marginTop: '8px' }}>
              Conectando ao servidor...
            </p>
          )}
        </div>
      </div>
      <p className={styles.copyright}>2026 . Onrizon Social Games</p>
      <style jsx global>{`
        :root {
          --asap-condensed: ${asapCondensed.style.fontFamily};
          --nunito: ${nunito.style.fontFamily};
        }
      `}</style>
    </div>
  );
}

export default function JoinWithModal() {
  return (
    <ModalWrapper>
      <Join />
    </ModalWrapper>
  );
}
