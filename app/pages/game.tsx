import { CameraPlaceholder } from '@/components/CameraPlaceholder';
import { Loading } from '@/components/Loading';
import { Menu } from '@/components/Menu';
import { AlertModal } from '@/components/modal/Alert';
import { InfoModal } from '@/components/modal/info';
import { SettingsModal } from '@/components/modal/settings';
import { Progress } from '@/components/Progress';
import { ThemeText } from '@/components/ThemeText';
import { Timer } from '@/components/Timer';
import { TopPlayers } from '@/components/TopPlayers';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/locales';
import styles from '@/styles/Game.module.css';
import confetti from 'canvas-confetti';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '../components/Grid';
import { FALLBACK_WORDS } from '../constants';
import { useTwitch } from '../hooks/useTwitch';
import { generateLayout } from '../services/layoutEngine';
import { UserScores, WordData } from '../types';

const DEFAULT_DURATION = 120;
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

const Game: React.FC = () => {
  const { changeLocale, locale } = useTranslation();
  const [customDuration, setCustomDuration] =
    useState<number>(DEFAULT_DURATION);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [showCameraArea, setShowCameraArea] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings from localStorage after hydration (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('streamCross');
      if (saved) {
        const settings = JSON.parse(saved);
        if (settings.language) changeLocale(settings.language);
        if (settings.duration) setCustomDuration(settings.duration);
        if (settings.webhookUrl) setWebhookUrl(settings.webhookUrl);
        if (settings.showCameraArea) setShowCameraArea(settings.showCameraArea);
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);

  // --- Game State ---
  const [currentTheme, setCurrentTheme] = useState<string>('ESCRITORIO');
  const [words, setWords] = useState<WordData[]>(FALLBACK_WORDS);
  const [timeLeft, setTimeLeft] = useState(customDuration);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [userScores, setUserScores] = useState<UserScores>({});
  const { data: session, status: sessionStatus } = useSession();
  const [hit, setYouHit] = useState(false);
  const router = useRouter();

  // Layout Scaling
  const [scale, setScale] = useState(1);

  // Settings Form State (Temporary state while modal is open)
  const [tempSettings, setTempSettings] = useState<{
    language: string;
    duration: number;
    webhookUrl: string;
    showCameraArea: boolean;
  }>({
    language: 'pt',
    duration: customDuration,
    webhookUrl,
    showCameraArea,
  });

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/');
    }
  }, [sessionStatus, router]);

  // --- Window Resize Effect ---
  // Lock aspect ratio logic: Fit the 1920x1080 container into the window
  useEffect(() => {
    const handleResize = () => {
      const scaleX = (window.innerWidth - 50) / BASE_WIDTH;
      const scaleY = (window.innerHeight - 50) / BASE_HEIGHT;
      // Use the smaller scale to ensure it fits entirely ("contain" logic)
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Game Logic ---

  const loadNewLevel = useCallback(
    async (targetLang?: string, durationOverride?: number) => {
      setIsLoading(true);
      setIsPaused(false);
      const langToUse = targetLang || locale;
      const durationToUse =
        durationOverride !== undefined ? durationOverride : customDuration;

      try {
        const data = await fetch(`/api/level?language=${langToUse}`).then(
          (res) => res.json()
        );
        const validLayout = generateLayout(data.words);
        if (validLayout.length < 5) {
          throw new Error(
            'Could not generate a valid grid structure. Try again.'
          );
        }

        setWords(validLayout);
        setCurrentTheme(data.theme);
        setTimeLeft(durationToUse); // Reset time to the configured duration
      } catch (err) {
        console.error(err);
        setTimeout(() => loadNewLevel(langToUse, durationToUse), 2000);
      } finally {
        setIsLoading(false);
      }
    },
    [locale, customDuration]
  );

  // --- Settings Logic ---
  const handleOpenSettings = () => {
    setIsPaused(true); // Pause immediately
    setTempSettings({
      language: locale,
      duration: customDuration,
      webhookUrl,
      showCameraArea,
    });
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    const hasLangChanged = tempSettings.language !== locale;
    const hasDurationChanged = tempSettings.duration !== customDuration;

    // Save to LocalStorage
    localStorage.setItem('streamCross', JSON.stringify(tempSettings));

    // Save to State
    changeLocale(tempSettings.language as Locale);
    setCustomDuration(tempSettings.duration);
    setWebhookUrl(tempSettings.webhookUrl);
    setShowCameraArea(tempSettings.showCameraArea);
    setIsSettingsOpen(false);

    // If critical settings changed, reload level immediately
    if (hasLangChanged || hasDurationChanged) {
      loadNewLevel(tempSettings.language, tempSettings.duration);
    } else {
      setIsPaused(false);
    }
  };

  const handleCloseSettingsWithoutSaving = () => {
    setIsSettingsOpen(false);
    if (!isInfoOpen) setIsPaused(false);
  };

  // --- Info Logic ---
  const handleOpenInfo = () => {
    setIsPaused(true);
    setIsInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
    if (!isSettingsOpen) setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleOpenAlert = () => {
    setIsPaused(true);
    setIsAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    if (!isSettingsOpen && !isInfoOpen) setIsPaused(false);
  };

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
      words === FALLBACK_WORDS
    ) {
      loadNewLevel();
    }
  }, [isHydrated]); // Run once after hydration

  const handleNextLevel = useCallback(() => {
    loadNewLevel();
  }, [loadNewLevel]);

  // Timer Effect
  useEffect(() => {
    if (isLoading || isPaused || isSettingsOpen || isInfoOpen) return;

    if (timeLeft <= 0) {
      handleNextLevel();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [
    timeLeft,
    handleNextLevel,
    isLoading,
    isPaused,
    isSettingsOpen,
    isInfoOpen,
  ]);

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

  // --- Twitch Integration & Webhook ---

  const triggerWebhook = async (username: string, word: string) => {
    if (!webhookUrl) return;

    try {
      const payload = {
        event: 'correct_guess',
        username,
        word,
        theme: currentTheme,
        timestamp: new Date().toISOString(),
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error('Webhook trigger failed', e);
    }
  };

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
        .replace(/ß/g, 'SS');

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
            [username]: (prev[username] || 0) + 100,
          }));

          playSuccessSound();
          triggerWebhook(username, cleanMessage);
          setTimeout(() => {
            setYouHit(false);
          }, 3000);
        }

        return newWords;
      });
    },
    [isLoading, handleNextLevel, currentTheme, webhookUrl]
  );

  useTwitch({ onMessage: handleTwitchMessage });

  return (
    // OUTER CONTAINER: Handles the Background and Centering
    <div className={styles.outerContainer}>
      {/* INNER SCALABLE CONTAINER: Fixed Resolution, Scaled via CSS */}
      <div
        className={styles.innerContainer}
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          flexShrink: 0, // Prevent flex compression
        }}
      >
        {/* HEADER: 4 Fixed Sections */}
        <header className={styles.header}>
          <div className={styles.headerLogoSection}>
            <span />
          </div>

          <div className={styles.headerContentSection}>
            {/* SECTION 2: THEME (Flexible/Fixed behavior) */}
            <ThemeText
              className={classNames({
                [styles.hitTheme]: hit,
              })}
              currentTheme={currentTheme}
              isLoading={isLoading}
            />

            {/* Timer */}
            <Timer
              timeLeft={timeLeft}
              isPaused={isPaused}
              isSettingsOpen={isSettingsOpen}
              isInfoOpen={isInfoOpen}
              tempSettings={tempSettings}
            />

            {/* Buttons Grid */}
            <Menu
              isLoading={isLoading}
              isPaused={isPaused}
              isSettingsOpen={isSettingsOpen}
              isInfoOpen={isInfoOpen}
              handleOpenSettings={handleOpenSettings}
              handleOpenInfo={handleOpenInfo}
              handlePause={handlePause}
              handleNextLevel={handleNextLevel}
              handleOpenAlert={handleOpenAlert}
            />

            {/* SECTION 4: PROGRESS (Fixed Width ~240px) */}
            <Progress words={words} />
          </div>
        </header>

        {/* Main Content Layout - Forced Horizontal (Desktop) */}
        <main className={styles.main}>
          {/* LEFT: Game Area (Flexible) */}
          <div className={styles.gameArea}>
            <div className={styles.gridContainer}>
              <div
                className={classNames(styles.gridLightLeft, {
                  [styles.gridLightLeftActive]: hit,
                })}
              ></div>
              <div
                className={classNames(styles.gridLightRight, {
                  [styles.gridLightRightActive]: hit,
                })}
              ></div>

              {/* Loading Overlay */}
              {isLoading && <Loading />}

              <div
                className={classNames(
                  styles.gridScrollContainer,
                  'custom-scrollbar'
                )}
              >
                <Grid words={words} />
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar (Fixed Width) - Layout always assumes horizontal desktop view */}
          <div className={styles.sidebar}>
            {/* Streamer Camera Placeholder */}
            {showCameraArea && <CameraPlaceholder />}

            {/* Leaderboard - Expanded to fill remaining space */}
            <TopPlayers
              userScores={userScores}
              showCameraArea={showCameraArea}
            />
          </div>
        </main>

        {/* SETTINGS MODAL */}
        <AnimatePresence>
          {isSettingsOpen && (
            <SettingsModal
              handleCloseSettingsWithoutSaving={
                handleCloseSettingsWithoutSaving
              }
              handleSaveSettings={handleSaveSettings}
              tempSettings={tempSettings}
              setTempSettings={setTempSettings}
            />
          )}
        </AnimatePresence>

        {/* INFO MODAL */}
        <AnimatePresence>
          {isInfoOpen && <InfoModal handleCloseInfo={handleCloseInfo} />}
        </AnimatePresence>

        {/* ALERT MODAL */}
        <AnimatePresence>
          {isAlertOpen && (
            <AlertModal
              handleLogout={handleLogout}
              handleCloseAlert={handleCloseAlert}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game;
