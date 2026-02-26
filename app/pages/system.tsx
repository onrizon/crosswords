import { useSocket } from '@/hooks/useSocket';
import { useTranslation } from '@/hooks/useTranslation';
import { SystemContext } from '@/lib/Context';
import styles from '@/styles/Main.module.css';
import { Player, UserScores, WordData } from '@/types/types';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import End from '../components/system/End';
import Start from '../components/system/Start';
import Game from '../components/system/game/Game';
import Modal from '../components/system/modal/Modal';
import * as C from '../constants';

const asapCondensed = localFont({
  src: [
    { path: '../_assets/fonts/AsapCondensed-Medium.ttf', weight: '500' },
    { path: '../_assets/fonts/AsapCondensed-SemiBold.ttf', weight: '600' },
    { path: '../_assets/fonts/AsapCondensed-Bold.ttf', weight: '700' },
    { path: '../_assets/fonts/AsapCondensed-ExtraBold.ttf', weight: '800' },
    { path: '../_assets/fonts/AsapCondensed-Black.ttf', weight: '900' },
  ],
  variable: '--asap-condensed',
});

const nunito = localFont({
  src: [
    { path: '../_assets/fonts/Nunito-Medium.ttf', weight: '500' },
    { path: '../_assets/fonts/Nunito-SemiBold.ttf', weight: '600' },
    { path: '../_assets/fonts/Nunito-Bold.ttf', weight: '700' },
    { path: '../_assets/fonts/Nunito-ExtraBold.ttf', weight: '800' },
    { path: '../_assets/fonts/Nunito-Black.ttf', weight: '900' },
  ],
  variable: '--nunito',
});

export default function Main() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const { locale } = useTranslation();

  const [scale, setScale] = useState(1);
  const [currentTheme, setCurrentTheme] = useState<string>('');
  const [status, setStatus] = useState(C.STATUS_START);
  const [words, setWords] = useState<WordData[]>([]);
  const [timeLeft, setTimeLeft] = useState(C.DEFAULT_DURATION);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userScores, setUserScores] = useState<UserScores>({});
  const [hit, setYouHit] = useState(false);
  const [lastHitInfo, setLastHitInfo] = useState<{
    username: string;
    word: string;
    index: number;
  } | null>(null);
  const hitTimeout = useRef<NodeJS.Timeout | null>(null);
  const [modal, setModal] = useState({
    type: C.CLOSED_MODAL,
    data: {},
  });
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [customDuration, setCustomDuration] = useState(C.DEFAULT_DURATION);

  // Scaling
  useEffect(() => {
    const handleResize = () => {
      const scaleX = (window.innerWidth - 50) / C.BASE_WIDTH;
      const scaleY = (window.innerHeight - 50) / C.BASE_HEIGHT;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get room code from URL
  useEffect(() => {
    const room = router.query.room as string;
    if (room) {
      setRoomCode(room);
    } else {
      const stored = sessionStorage.getItem('roomCode');
      if (stored) setRoomCode(stored);
    }
  }, [router.query.room]);

  // Register display with server
  useEffect(() => {
    if (!socket || !isConnected || !roomCode) return;

    socket.emit('display:register', { roomCode });
  }, [socket, isConnected, roomCode]);

  // Sound effect helper
  const playSuccessSound = async () => {
    try {
      const audio = new Audio(
        'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'
      );
      audio.volume = 0.2;
      await audio.play().catch((error) => {
        console.debug('Audio play failed:', error);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleModal = useCallback((type: number, data: React.FC) => {
    setModal({ type, data });
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    function onStateUpdate(state: Record<string, unknown>) {
      if (state.status !== undefined) setStatus(state.status as number);
      if (state.currentTheme !== undefined) setCurrentTheme(state.currentTheme as string);
      if (state.words !== undefined) setWords(state.words as WordData[]);
      if (state.timeLeft !== undefined) setTimeLeft(state.timeLeft as number);
      if (state.isLoading !== undefined) setIsLoading(state.isLoading as boolean);
      if (state.isPaused !== undefined) setIsPaused(state.isPaused as boolean);
      if (state.playerScores !== undefined) setUserScores(state.playerScores as UserScores);
      if (state.players !== undefined) setPlayers(state.players as Player[]);
      if (state.duration !== undefined) setCustomDuration(state.duration as number);
    }

    function onNewLevel({ theme, words: newWords, timeLeft: tl, playerScores }: {
      theme: string;
      words: WordData[];
      timeLeft: number;
      playerScores: UserScores;
    }) {
      setCurrentTheme(theme);
      setWords(newWords);
      setTimeLeft(tl);
      setUserScores(playerScores);
      setYouHit(false);
      setLastHitInfo(null);
      if (hitTimeout.current) clearTimeout(hitTimeout.current);
    }

    function onTick({ timeLeft: tl }: { timeLeft: number }) {
      setTimeLeft(tl);
    }

    function onWordRevealed({ wordIndex, revealedBy, playerScores, lastHit }: {
      wordIndex: number;
      revealedBy: string;
      playerScores: UserScores;
      lastHit: { username: string; word: string; index: number };
    }) {
      setWords((prev) =>
        prev.map((w, i) =>
          i === wordIndex ? { ...w, isRevealed: true, revealedBy } : w
        )
      );
      setUserScores(playerScores);
      setYouHit(true);
      setLastHitInfo(lastHit);
      playSuccessSound();

      if (hitTimeout.current) clearTimeout(hitTimeout.current);
      hitTimeout.current = setTimeout(() => {
        setYouHit(false);
        setLastHitInfo(null);
      }, 3000);
    }

    function onStarted({ status: s }: { status: number }) {
      setStatus(s);
    }

    function onEnded({ status: s, finalScores }: { status: number; finalScores: UserScores }) {
      setStatus(s);
      setUserScores(finalScores);
    }

    function onLoading({ isLoading: loading }: { isLoading: boolean }) {
      setIsLoading(loading);
    }

    function onPaused() {
      setIsPaused(true);
    }

    function onResumed() {
      setIsPaused(false);
    }

    function onPlayerList({ players: p }: { players: Player[] }) {
      setPlayers(p);
    }

    function onResetToStart({ status: s }: { status: number }) {
      setStatus(s);
      setWords([]);
      setCurrentTheme('');
      setTimeLeft(customDuration);
      setUserScores({});
      setIsLoading(false);
      setIsPaused(false);
      setYouHit(false);
      setLastHitInfo(null);
      if (hitTimeout.current) clearTimeout(hitTimeout.current);
    }

    socket.on('display:stateUpdate', onStateUpdate);
    socket.on('game:newLevel', onNewLevel);
    socket.on('game:tick', onTick);
    socket.on('game:wordRevealed', onWordRevealed);
    socket.on('game:started', onStarted);
    socket.on('game:ended', onEnded);
    socket.on('game:loading', onLoading);
    socket.on('game:paused', onPaused);
    socket.on('game:resumed', onResumed);
    socket.on('room:playerList', onPlayerList);
    socket.on('game:resetToStart', onResetToStart);

    return () => {
      socket.off('display:stateUpdate', onStateUpdate);
      socket.off('game:newLevel', onNewLevel);
      socket.off('game:tick', onTick);
      socket.off('game:wordRevealed', onWordRevealed);
      socket.off('game:started', onStarted);
      socket.off('game:ended', onEnded);
      socket.off('game:loading', onLoading);
      socket.off('game:paused', onPaused);
      socket.off('game:resumed', onResumed);
      socket.off('room:playerList', onPlayerList);
      socket.off('game:resetToStart', onResetToStart);
    };
  }, [socket]);

  return (
    <SystemContext.Provider
      value={{
        currentTheme,
        words,
        timeLeft,
        isLoading,
        isPaused,
        userScores,
        hit,
        lastHitInfo,
        setYouHit,
        handleModal,
        modal,
        customDuration,
        setCustomDuration,
        locale,
        roomCode,
        isConnected,
        players,
        socket,
      }}
    >
      <div className={styles.main}>
        <div
          className={styles.mainContainer}
          style={{
            width: `${C.BASE_WIDTH}px`,
            height: `${C.BASE_HEIGHT}px`,
            transform: `scale(${scale})`,
            flexShrink: 0,
          }}
        >
          {(() => {
            switch (status) {
              case C.STATUS_START:
                return <Start />;
              case C.STATUS_GAME:
                return <Game />;
              case C.STATUS_END:
                return <End />;
              default:
                return null;
            }
          })()}
          <Modal />
        </div>
      </div>
      <style jsx global>{`
        :root {
          --asap-condensed: ${asapCondensed.style.fontFamily};
          --nunito: ${nunito.style.fontFamily};
        }
      `}</style>
    </SystemContext.Provider>
  );
}
