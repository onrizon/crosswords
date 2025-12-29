import { CameraPlaceholder } from '@/components/CameraPlaceholder';
import { Menu } from '@/components/Menu';
import { InfoModal } from '@/components/modal/info';
import { SettingsModal } from '@/components/modal/settings';
import { Progress } from '@/components/Progress';
import { ThemeText } from '@/components/ThemeText';
import { Timer } from '@/components/Timer';
import { TopPlayers } from '@/components/TopPlayers';
import styles from '@/styles/Game.module.css';
import confetti from 'canvas-confetti';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '../components/Grid';
import { FALLBACK_WORDS, UI_TEXT } from '../constants';
import { useTwitch } from '../hooks/useTwitch';
import { generateLayout } from '../services/layoutEngine';
import { SupportedLanguage, UserScores, WordData } from '../types';

const DEFAULT_DURATION = 120;
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

const Game: React.FC = () => {
  // --- Settings State (Initialized from LocalStorage) ---
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('cruzadinha_settings');
      return saved ? JSON.parse(saved).language || 'pt' : 'pt';
    } catch {
      return 'pt';
    }
  });

  const [customDuration, setCustomDuration] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cruzadinha_settings');
      return saved
        ? JSON.parse(saved).duration || DEFAULT_DURATION
        : DEFAULT_DURATION;
    } catch {
      return DEFAULT_DURATION;
    }
  });

  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cruzadinha_settings');
      return saved ? JSON.parse(saved).webhookUrl || '' : '';
    } catch {
      return '';
    }
  });

  // --- Game State ---
  const [currentTheme, setCurrentTheme] = useState<string>('ESCRITORIO');
  const [words, setWords] = useState<WordData[]>(FALLBACK_WORDS);
  const [timeLeft, setTimeLeft] = useState(customDuration);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [userScores, setUserScores] = useState<UserScores>({});
  const { data: session, status: sessionStatus } = useSession();
  const [hit, setYouHit] = useState(false);
  const router = useRouter();

  // Layout Scaling
  const [scale, setScale] = useState(1);

  // Settings Form State (Temporary state while modal is open)
  const [tempSettings, setTempSettings] = useState<{
    language: SupportedLanguage;
    duration: number;
    webhookUrl: string;
  }>({
    language,
    duration: customDuration,
    webhookUrl,
  });

  const t = UI_TEXT[language];

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/');
    }
  }, [sessionStatus, router]);

  // --- Window Resize Effect ---
  // Lock aspect ratio logic: Fit the 1920x1080 container into the window
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / BASE_WIDTH;
      const scaleY = window.innerHeight / BASE_HEIGHT;
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
    async (targetLang?: SupportedLanguage, durationOverride?: number) => {
      setIsLoading(true);
      setIsPaused(false);
      const langToUse = targetLang || language;
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
    [language, customDuration]
  );

  // --- Settings Logic ---
  const handleOpenSettings = () => {
    setIsPaused(true); // Pause immediately
    setTempSettings({ language, duration: customDuration, webhookUrl });
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    const hasLangChanged = tempSettings.language !== language;
    const hasDurationChanged = tempSettings.duration !== customDuration;

    // Save to LocalStorage
    localStorage.setItem('cruzadinha_settings', JSON.stringify(tempSettings));

    // Save to State
    setLanguage(tempSettings.language);
    setCustomDuration(tempSettings.duration);
    setWebhookUrl(tempSettings.webhookUrl);

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

  // Initial load
  useEffect(() => {
    if (currentTheme === 'ESCRITORIO' && words === FALLBACK_WORDS) {
      loadNewLevel();
    }
  }, []); // Run once

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
  }, [words, handleNextLevel, isLoading, t.levelComplete]);

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
    [isLoading, t.guessed, handleNextLevel, currentTheme, webhookUrl]
  );

  useTwitch({ onMessage: handleTwitchMessage });

  // --- Render Helpers ---

  return (
    // OUTER CONTAINER: Handles the Background and Centering
    <div className={styles.outerContainer}>
      {/* INNER SCALABLE CONTAINER: Fixed Resolution, Scaled via CSS */}
      <div
        className={styles.innerContainer}
        style={{
          width: `calc(${BASE_WIDTH}px - 30px)`,
          height: `${BASE_HEIGHT + 26}px`,
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
              language={language}
              t={t.generating}
            />

            {/* Timer */}
            <Timer
              timeLeft={timeLeft}
              isPaused={isPaused}
              isSettingsOpen={isSettingsOpen}
              isInfoOpen={isInfoOpen}
              t={t.time}
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
            />

            {/* SECTION 4: PROGRESS (Fixed Width ~240px) */}
            <Progress words={words} t={t.progress} />
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
              {isLoading && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.loadingGlow}>
                    <Loader2 size={80} className={styles.loadingSpinnerIcon} />
                  </div>
                  <h2 className={styles.loadingTitle}>{t.loadingTitle}</h2>
                  <p className={styles.loadingSubtitle}>{t.loadingSubtitle}</p>
                </div>
              )}

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
            <CameraPlaceholder
              isLoading={isLoading}
              isSettingsOpen={isSettingsOpen}
              handleLogout={handleLogout}
            />

            {/* Leaderboard - Expanded to fill remaining space */}
            <TopPlayers userScores={userScores} t={t} />
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
          {isInfoOpen && <InfoModal handleCloseInfo={handleCloseInfo} t={t} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game;
