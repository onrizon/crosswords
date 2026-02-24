import { useTranslation } from '@/hooks/useTranslation';
import { Context } from '@/lib/Context';
import styles from '@/styles/Main.module.css';
import { UserScores, WordData } from '@/types/types';
import { signOut, useSession } from 'next-auth/react';
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
  const [scale, setScale] = useState(1);
  const [currentTheme, setCurrentTheme] = useState<string>('ESCRITORIO');
  const [status, setStatus] = useState(C.STATUS_START);
  const [words, setWords] = useState<WordData[]>(C.FALLBACK_WORDS);
  const [customDuration, setCustomDuration] = useState<number>(
    C.DEFAULT_DURATION
  );
  const [timeLeft, setTimeLeft] = useState(customDuration);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userScores, setUserScores] = useState<UserScores>({});
  const { data: session, status: sessionStatus } = useSession();
  const [hit, setYouHit] = useState(false);
  const [lastHitInfo, setLastHitInfo] = useState<{
    username: string;
    word: string;
    index: number;
  } | null>(null);
  const hitTimeout = useRef<NodeJS.Timeout | null>(null);
  const { changeLocale, locale } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);
  const [modal, setModal] = useState({
    type: C.CLOSED_MODAL,
    data: {},
  });
  const router = useRouter();

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

  // Load settings from localStorage after hydration (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('streamCross');
      if (saved) {
        const settings = JSON.parse(saved);
        if (settings.language) changeLocale(settings.language);
        if (settings.duration) setCustomDuration(settings.duration);
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/');
    }
  }, [sessionStatus, router]);

  // --- Game Logic ---
  const loadNewLevel = useCallback(
    async (targetLang?: string, durationOverride?: number) => {
      if (hitTimeout.current) clearTimeout(hitTimeout.current);
      setIsLoading(true);
      setIsPaused(false);
      const langToUse = targetLang || locale;
      const durationToUse =
        durationOverride !== undefined ? durationOverride : customDuration;

      try {
        const response = await fetch(`/api/level?language=${langToUse}`);
        if (!response.ok) {
          throw new Error('Failed to generate level');
        }
        const data = await response.json();

        setWords(data.words);
        setCurrentTheme(data.theme);
        setTimeLeft(durationToUse);
        setUserScores(
          (users) =>
            Object.fromEntries(
              Object.entries(users).map(([username, scores]) => [
                username,
                { total: scores.total, round: 0 },
              ])
            ) as UserScores
        );
      } catch (err) {
        console.error(err);
        setTimeout(() => loadNewLevel(langToUse, durationToUse), 2000);
      } finally {
        setIsLoading(false);
        setYouHit(false);
        setLastHitInfo(null);
      }
    },
    [locale, customDuration]
  );

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleModal = useCallback((type: number, data: React.FC) => {
    setModal({ type, data });
  }, []);

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

  // Initial load - wait for hydration to ensure localStorage settings are loaded
  useEffect(() => {
    if (
      isHydrated &&
      currentTheme === 'ESCRITORIO' &&
      words === C.FALLBACK_WORDS
    ) {
      loadNewLevel();
    }
  }, [isHydrated]); // Run once after hydration

  const handleNextLevel = useCallback(() => {
    loadNewLevel();
  }, [loadNewLevel]);

  // Timer Effect
  useEffect(() => {
    if (isLoading || isPaused) return;

    if (timeLeft <= 0) {
      handleNextLevel();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleNextLevel, isLoading, isPaused]);

  // Check for level completion
  useEffect(() => {
    const allSolved = words.every((w) => w.isRevealed);
    if (allSolved && words.length > 0 && !isLoading) {
      const timeout = setTimeout(() => {
        handleNextLevel();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [words, handleNextLevel, isLoading]);

  const handleTwitchMessage = useCallback(
    (username: string, message: string) => {
      const msgLower = message.trim().toLowerCase();
      const userLower = username.toLowerCase();
      const adminUser = session?.user?.twitchLogin || ''.toLowerCase();

      // Admin Commands
      if (userLower === adminUser) {
        if (msgLower === '!refresh') {
          handleNextLevel();
          return;
        }
        if (msgLower === '!reset') {
          setUserScores({});
          handleNextLevel();
          return;
        }
        if (msgLower === '!pause') {
          setIsPaused(true);
          return;
        }
        if (msgLower === '!resume' || msgLower === '!play') {
          setIsPaused(false);
          return;
        }
      }

      if (isLoading) return;

      const cleanMessage = message
        .trim()
        .toUpperCase()
        .replace(/Ç/g, 'C')
        .replace(/[ÁÀÂÃÄ]/g, 'A')
        .replace(/[ÉÊË]/g, 'E')
        .replace(/[ÍÏ]/g, 'I')
        .replace(/[ÓÔÕÖ]/g, 'O')
        .replace(/[ÚÜ]/g, 'U')
        .replace(/Ñ/g, 'N')
        .replace(/ß/g, 'SS')
        .replace(/(\s|-)+/g, '');

      setWords((currentWords) => {
        let wordFound = false;
        let foundWordIndex = -1;
        const newWords = currentWords.map((w, index) => {
          if (!w.isRevealed && w.word === cleanMessage) {
            wordFound = true;
            foundWordIndex = index;
            return { ...w, isRevealed: true, revealedBy: username };
          }
          return w;
        });

        if (wordFound && foundWordIndex >= 0) {
          setYouHit(true);
          setLastHitInfo({
            username: username.toUpperCase(),
            word: cleanMessage,
            index: foundWordIndex + 1,
          });

          setUserScores((prev) => ({
            ...prev,
            [username]: !prev[username]
              ? { round: 1, total: 1 }
              : {
                round: prev[username].round + 1,
                total: prev[username].total + 1,
              },
          }));

          playSuccessSound();
          if (hitTimeout.current) clearTimeout(hitTimeout.current);
          hitTimeout.current = setTimeout(() => {
            setYouHit(false);
            setLastHitInfo(null);
          }, 3000);
        }

        return newWords;
      });
    },
    [isLoading, handleNextLevel, currentTheme]
  );

  return (
    <Context.Provider
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
        loadNewLevel,
        handlePause,
        handleLogout,
        handleModal,
        modal,
        handleTwitchMessage,
        customDuration,
        setCustomDuration,
        setIsPaused,
        handleNextLevel,
        locale,
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
          onClick={() => setStatus((status) => status + 1)}
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
    </Context.Provider>
  );
}
