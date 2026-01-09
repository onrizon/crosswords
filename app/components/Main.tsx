import { useTranslation } from '@/hooks/useTranslation';
import { useTwitch } from '@/hooks/useTwitch';
import { Context } from '@/lib/Context';
import { Locale } from '@/locales';
import styles from '@/styles/Main.module.css';
import { UserScores, WordData } from '@/types';
import confetti from 'canvas-confetti';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import * as C from '../constants';

export default function Main({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);
  const [currentTheme, setCurrentTheme] = useState<string>('ESCRITORIO');
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
  const { changeLocale, locale } = useTranslation();
  const [showCameraArea, setShowCameraArea] = useState<boolean>(false);
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
        if (settings.showCameraArea) setShowCameraArea(settings.showCameraArea);
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);

  // Settings Form State (Temporary state while modal is open)
  const [tempSettings, setTempSettings] = useState<{
    language: string;
    duration: number;
    showCameraArea: boolean;
  }>({
    language: 'pt',
    duration: customDuration,
    showCameraArea,
  });

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/');
    }
  }, [sessionStatus, router]);

  // --- Game Logic ---
  const loadNewLevel = useCallback(
    async (targetLang?: string, durationOverride?: number) => {
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
      }
    },
    [locale, customDuration]
  );

  const handleSaveSettings = () => {
    const hasLangChanged = tempSettings.language !== locale;
    const hasDurationChanged = tempSettings.duration !== customDuration;

    // Save to LocalStorage
    localStorage.setItem('streamCross', JSON.stringify(tempSettings));

    // Save to State
    changeLocale(tempSettings.language as Locale);
    setCustomDuration(tempSettings.duration);
    setShowCameraArea(tempSettings.showCameraArea);

    // If critical settings changed, reload level immediately
    if (hasLangChanged || hasDurationChanged) {
      loadNewLevel(tempSettings.language, tempSettings.duration);
    } else {
      setIsPaused(false);
    }
  };

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
  const playSuccessSound = () => {
    try {
      const audio = new Audio(
        'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'
      );
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch (e) {}
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
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#f59e0b'],
      });
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
        const newWords = currentWords.map((w) => {
          if (!w.isRevealed && w.word === cleanMessage) {
            wordFound = true;
            return { ...w, isRevealed: true, revealedBy: username };
          }
          return w;
        });

        if (wordFound) {
          setYouHit(true);

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
          setTimeout(() => {
            setYouHit(false);
          }, 3000);
        }

        return newWords;
      });
    },
    [isLoading, handleNextLevel, currentTheme]
  );

  useTwitch({ onMessage: handleTwitchMessage });

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
        setYouHit,
        loadNewLevel,
        handleSaveSettings,
        handlePause,
        handleLogout,
        handleModal,
        playSuccessSound,
        modal,
        showCameraArea,
        setShowCameraArea,
        handleTwitchMessage,
        tempSettings,
        setTempSettings,
        customDuration,
        setCustomDuration,
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
        >
          {children}
        </div>
      </div>
    </Context.Provider>
  );
}
