import ModalWrapper from '@/components/mobile/ModalWrapper';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { ModalContext } from '@/lib/Context';
import nick from '@/public/lotties/nick.json';
import styles from '@/styles/mobile/Index.module.css';
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

function Index() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const { isAuthenticated, user, loginWithTwitch, loginWithDiscord } = useAuth();
  const setModal = useContext(ModalContext) as ModalContextProps["setModal"];
  const [nickname, setNickname] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const autoJoinedRef = useRef(false);

  // Room code from QR scan (display's creation QR)
  const roomCodeFromQuery = (router.query.room as string) || '';
  const isCreationMode = !!roomCodeFromQuery;

  // After OAuth redirect: if user is authenticated and we have a room code, auto-join as owner
  useEffect(() => {
    if (!isCreationMode || !isAuthenticated || !user || !socket || !isConnected || autoJoinedRef.current) return;

    autoJoinedRef.current = true;
    const provider = user.twitchLogin ? 'twitch' : user.discordUsername ? 'discord' : null;
    const playerName = user.twitchLogin || user.discordUsername || user.name || 'Player';

    setIsJoining(true);
    socket.emit('room:join', {
      roomCode: roomCodeFromQuery.toUpperCase(),
      playerName,
      provider,
    });
  }, [isCreationMode, isAuthenticated, user, socket, isConnected, roomCodeFromQuery]);

  // Listen for join result
  useEffect(() => {
    if (!socket) return;

    function onJoined({ roomState, playerId }: { roomState: RoomState; playerId: string }) {
      const code = roomState.code;
      const name = user?.twitchLogin || user?.discordUsername || user?.name || nickname;
      sessionStorage.setItem('roomCode', code);
      sessionStorage.setItem('playerId', playerId);
      sessionStorage.setItem('playerName', name);
      router.push(`/mobile/system?room=${code}`);
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
  }, [socket, nickname, user, router, setModal]);

  function handleCreate() {
    if (!nickname.trim()) {
      setModal({
        title: 'Nome Inválido',
        lottie: nick,
        description: 'Digite um apelido válido',
      });
      return;
    }
    if (!isConnected) return;

    setIsJoining(true);
    socket.emit('room:join', {
      roomCode: roomCodeFromQuery.toUpperCase(),
      playerName: nickname.trim(),
    });
  }

  function handleJoinManual() {
    if (!nickname.trim()) {
      setModal({
        title: 'Nome Inválido',
        lottie: nick,
        description: 'Digite um apelido válido',
      });
      return;
    }
    if (!manualCode.trim() || manualCode.trim().length !== 4) {
      setModal({
        title: 'Código Inválido',
        lottie: nick,
        description: 'Digite um código de sala com 4 caracteres',
      });
      return;
    }
    sessionStorage.setItem('playerName', nickname.trim());
    router.push(`/mobile/join?room=${manualCode.trim().toUpperCase()}`);
  }

  // Build callback URL that preserves the room query param after OAuth
  const oauthCallback = isCreationMode
    ? `/mobile?room=${roomCodeFromQuery}`
    : '/mobile';

  return (
    <div className={styles.container}>
      <div className={styles.logo}></div>
      <div className={styles.content}>
        <h2>{isCreationMode ? 'CRIAR SALA' : 'ENTRAR NA SALA'}</h2>
        <div className={styles.box}>
          {/* Manual room code input — only when there's no room code in URL */}
          {!isCreationMode && (
            <>
              <h4>
                <div className={styles.icon} />
                Código da sala
              </h4>
              <input
                className={styles.input}
                type="text"
                placeholder="ABCD"
                value={manualCode}
                maxLength={4}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase', letterSpacing: '4px', textAlign: 'center' }}
              />
            </>
          )}

          <h4 style={!isCreationMode ? { marginTop: '16px' } : undefined}>
            <div className={styles.icon} />
            Seu nickname
          </h4>
          <input
            className={styles.input}
            type="text"
            placeholder="Player2234"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (isCreationMode ? handleCreate() : handleJoinManual())}
          />

          <button
            onClick={isCreationMode ? handleCreate : handleJoinManual}
            disabled={isJoining || !isConnected}
            className={classNames(styles.btn, styles.btnPrimary)}
          >
            {isJoining ? 'Entrando...' : isCreationMode ? 'Criar Sala' : 'Entrar'}
          </button>

          {isCreationMode && (
            <>
              <p className={styles.or}>OU</p>
              <div className={styles.buttons}>
                <button
                  onClick={() => loginWithTwitch(oauthCallback)}
                  disabled={isJoining}
                  className={classNames(styles.btn, styles.btnSecondary, styles.twitch)}
                >
                  <div className={styles.icon} />
                  Twitch
                </button>
                <button
                  onClick={() => loginWithDiscord(oauthCallback)}
                  disabled={isJoining}
                  className={classNames(styles.btn, styles.btnSecondary, styles.discord)}
                >
                  <div className={styles.icon} />
                  Discord
                </button>
              </div>
            </>
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

export default function IndexWithModal() {
  return (
    <ModalWrapper>
      <Index />
    </ModalWrapper>
  );
}
