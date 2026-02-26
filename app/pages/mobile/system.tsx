import End from '@/components/mobile/End';
import Game from '@/components/mobile/Game';
import ModalWrapper from '@/components/mobile/ModalWrapper';
import Settings from '@/components/mobile/Settings';
import { useSocket } from '@/hooks/useSocket';
import { SystemContext } from '@/lib/Context';

import * as C from '@/constants';
import styles from '@/styles/mobile/System.module.css';
import { Player, UserScores, WordData } from '@/types/types';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

export default function SystemWithModal() {
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  const [status, setStatus] = useState(C.STATUS_START);
  const [isOwner, setIsOwner] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerScores, setPlayerScores] = useState<UserScores>({});
  const [words, setWords] = useState<WordData[]>([]);
  const [currentTheme, setCurrentTheme] = useState('');
  const [timeLeft, setTimeLeft] = useState(C.DEFAULT_DURATION);
  const [isLoading, setIsLoading] = useState(false);
  const [roundNumber, setRoundNumber] = useState(0);
  const [duration, setDuration] = useState(C.DEFAULT_DURATION);
  const [language, setLanguage] = useState('pt');
  const [endMode, setEndMode] = useState(1);
  const [endTarget, setEndTarget] = useState(200);

  // Get room code from URL or session
  useEffect(() => {
    const room = (router.query.room as string) || sessionStorage.getItem('roomCode') || '';
    setRoomCode(room);

    // Check if this player is the owner
    const playerId = sessionStorage.getItem('playerId');
    if (playerId && socket?.id === playerId) {
      // Will be confirmed by server state
    }
  }, [router.query.room, socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    function onStarted({ status: s }: { status: number }) {
      setStatus(s);
    }

    function onEnded({ status: s, finalScores }: { status: number; finalScores: UserScores }) {
      setStatus(s);
      setPlayerScores(finalScores);
    }

    function onNewLevel({ theme, words: w, timeLeft: tl, roundNumber: rn, playerScores: ps }: {
      theme: string;
      words: WordData[];
      timeLeft: number;
      roundNumber: number;
      playerScores: UserScores;
    }) {
      setCurrentTheme(theme);
      setWords(w);
      setTimeLeft(tl);
      setRoundNumber(rn);
      setPlayerScores(ps);
    }

    function onTick({ timeLeft: tl }: { timeLeft: number }) {
      setTimeLeft(tl);
    }

    function onWordRevealed({ wordIndex, revealedBy, playerScores: ps }: {
      wordIndex: number;
      revealedBy: string;
      playerScores: UserScores;
    }) {
      setWords((prev) =>
        prev.map((w, i) =>
          i === wordIndex ? { ...w, isRevealed: true, revealedBy } : w
        )
      );
      setPlayerScores(ps);
    }

    function onPlayerList({ players: p }: { players: Player[] }) {
      setPlayers(p);
      // Check ownership
      if (socket?.id) {
        const me = p.find((pl) => pl.id === socket.id);
        // Owner is the room creator — check from room state
      }
    }

    function onLoading({ isLoading: loading }: { isLoading: boolean }) {
      setIsLoading(loading);
    }

    function onStateUpdate(state: Record<string, unknown>) {
      if (state.ownerId !== undefined && socket?.id) {
        setIsOwner(state.ownerId === socket.id);
      }
      if (state.status !== undefined) setStatus(state.status as number);
      if (state.duration !== undefined) setDuration(state.duration as number);
      if (state.language !== undefined) setLanguage(state.language as string);
      if (state.endMode !== undefined) setEndMode(state.endMode as number);
      if (state.endTarget !== undefined) setEndTarget(state.endTarget as number);
      if (state.players !== undefined) setPlayers(state.players as Player[]);
      if (state.playerScores !== undefined) setPlayerScores(state.playerScores as UserScores);
      if (state.currentTheme !== undefined) setCurrentTheme(state.currentTheme as string);
      if (state.words !== undefined) setWords(state.words as WordData[]);
      if (state.timeLeft !== undefined) setTimeLeft(state.timeLeft as number);
      if (state.roundNumber !== undefined) setRoundNumber(state.roundNumber as number);
    }

    // Register as display to receive full state
    if (isConnected && roomCode) {
      socket.emit('display:register', { roomCode });
    }

    function onResetToStart({ status: s }: { status: number }) {
      setStatus(s);
      setWords([]);
      setCurrentTheme('');
      setTimeLeft(duration);
      setRoundNumber(0);
      setPlayerScores({});
      setIsLoading(false);
    }

    socket.on('game:started', onStarted);
    socket.on('game:ended', onEnded);
    socket.on('game:newLevel', onNewLevel);
    socket.on('game:tick', onTick);
    socket.on('game:wordRevealed', onWordRevealed);
    socket.on('room:playerList', onPlayerList);
    socket.on('game:loading', onLoading);
    socket.on('display:stateUpdate', onStateUpdate);
    socket.on('game:resetToStart', onResetToStart);

    return () => {
      socket.off('game:started', onStarted);
      socket.off('game:ended', onEnded);
      socket.off('game:newLevel', onNewLevel);
      socket.off('game:tick', onTick);
      socket.off('game:wordRevealed', onWordRevealed);
      socket.off('room:playerList', onPlayerList);
      socket.off('game:loading', onLoading);
      socket.off('display:stateUpdate', onStateUpdate);
      socket.off('game:resetToStart', onResetToStart);
    };
  }, [socket, isConnected, roomCode]);

  return (
    <SystemContext.Provider value={{
      isOwner,
      roomCode,
      socket,
      isConnected,
      players,
      playerScores,
      status,
      words,
      currentTheme,
      timeLeft,
      isLoading,
      roundNumber,
      duration,
      language,
      endMode,
      endTarget,
    }}>
      <ModalWrapper>
        <div className={styles.container}>
          {(() => {
            switch (status) {
              case C.STATUS_START:
                return <Settings />;
              case C.STATUS_GAME:
                return <Game />;
              case C.STATUS_END:
                return <End />;
              default:
                return null;
            }
          })()}
        </div>
        <style jsx global>{`
        :root {
          --asap-condensed: ${asapCondensed.style.fontFamily};
          --nunito: ${nunito.style.fontFamily};
        }
      `}</style>
      </ModalWrapper>
    </SystemContext.Provider>);
}
