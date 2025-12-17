import { CameraPlaceholder } from '@/components/cameraPlaceholder';
import { Menu } from '@/components/menu';
import { Progress } from '@/components/progress';
import { ThemeText } from '@/components/themeText';
import { Timer } from '@/components/timer';
import { TopPlayers } from '@/components/topPlayers';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Crown,
  Info,
  LayoutGrid,
  Loader2,
  Radio,
  Save,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
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
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [userScores, setUserScores] = useState<UserScores>({});
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // Layout Scaling
  const [scale, setScale] = useState(1);

  // Settings Form State (Temporary state while modal is open)
  const [tempSettings, setTempSettings] = useState({
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
      setGenerationError(null);
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
        setNotification(`${UI_TEXT[langToUse].newTheme}: ${data.theme}!`);
        setTimeout(() => setNotification(null), 3000);
      } catch (err) {
        console.error(err);
        setGenerationError('Erro ao gerar nível. Tentando novamente...');
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
      setNotification(t.levelComplete);
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
          setNotification('PONTUAÇÃO ZERADA PELO ADMIN!');
          setTimeout(() => setNotification(null), 3000);
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
          setNotification(`${username} ${t.guessed} ${cleanMessage}!`);

          setUserScores((prev) => ({
            ...prev,
            [username]: (prev[username] || 0) + 100,
          }));

          playSuccessSound();
          triggerWebhook(username, cleanMessage);
          setTimeout(() => setNotification(null), 3000);
        }

        return newWords;
      });
    },
    [isLoading, t.guessed, handleNextLevel, currentTheme, webhookUrl]
  );

  const { status } = useTwitch({ onMessage: handleTwitchMessage });

  // --- Render Helpers ---

  return (
    // OUTER CONTAINER: Handles the Background and Centering
    <div className='fixed inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 overflow-hidden flex items-center justify-center bg-black'>
      {/* INNER SCALABLE CONTAINER: Fixed Resolution, Scaled via CSS */}
      <div
        className='relative text-slate-100 flex flex-col items-center py-6 px-8 gap-4 font-sans overflow-hidden selection:bg-purple-500 selection:text-white shadow-2xl origin-center'
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          flexShrink: 0, // Prevent flex compression
        }}
      >
        {/* HEADER: 4 Fixed Sections */}
        <header className='flex-shrink-0 w-full flex items-center gap-0 bg-slate-900/60 p-0 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl z-20 relative h-32 overflow-hidden'>
          {/* SECTION 1: LOGO (Fixed Width ~350px) */}
          <div className='w-[380px] h-full flex items-center gap-5 px-8 border-r border-white/5 bg-black/20'>
            <div className='p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-900/50 ring-1 ring-white/20'>
              <LayoutGrid size={32} className='text-white' />
            </div>
            <div className='flex flex-col'>
              <h1 className='text-4xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 drop-shadow-sm tracking-tight leading-none mb-1'>
                StreamCross
                <span className='text-sm text-slate-500 block'>
                  {session?.user?.twitchLogin}
                </span>
              </h1>
              <div className='flex items-center gap-2'>
                <Radio
                  size={14}
                  className={
                    status === 'connected'
                      ? 'text-emerald-400 animate-pulse'
                      : 'text-red-500'
                  }
                />
                <span
                  className={`text-xs font-bold uppercase ${
                    status === 'connected' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {status === 'connected' ? t.live : t.offline}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: THEME (Flexible/Fixed behavior) */}
          <ThemeText
            currentTheme={currentTheme}
            isLoading={isLoading}
            language={language}
            t={t.generating}
          />

          {/* SECTION 3: TIME & OPTIONS (Fixed Width ~500px) */}
          <div className='w-[480px] h-full flex items-center justify-between px-8 border-l border-white/5 bg-black/20'>
            {/* Timer */}
            <Timer
              timeLeft={timeLeft}
              isPaused={isPaused}
              isSettingsOpen={isSettingsOpen}
              isInfoOpen={isInfoOpen}
              t={t.time}
            />

            {/* Divider */}
            <div className='w-px h-12 bg-white/10' />

            {/* Buttons Grid */}
            <Menu
              isLoading={isLoading}
              isPaused={isPaused}
              isSettingsOpen={isSettingsOpen}
              isInfoOpen={isInfoOpen}
              handleOpenSettings={handleOpenSettings}
              handleOpenInfo={handleOpenInfo}
              handleLogout={handleLogout}
              handlePause={handlePause}
              handleNextLevel={handleNextLevel}
            />
          </div>

          {/* SECTION 4: PROGRESS (Fixed Width ~240px) */}
          <Progress words={words} t={t.progress} />
        </header>

        {/* Main Content Layout - Forced Horizontal (Desktop) */}
        <main className='w-full flex-1 flex flex-row gap-8 items-start min-h-0 overflow-hidden pt-2'>
          {/* LEFT: Game Area (Flexible) */}
          <div className='flex-1 flex flex-col gap-6 w-full h-full overflow-hidden'>
            <div className='flex-1 flex flex-col justify-center overflow-hidden relative border border-white/10 rounded-3xl bg-slate-900/40 backdrop-blur-sm shadow-2xl'>
              {/* Loading Overlay */}
              {isLoading && (
                <div className='absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse rounded-full'></div>
                    <Loader2
                      size={80}
                      className='text-purple-500 animate-spin mb-8 relative z-10'
                    />
                  </div>
                  <h2 className='text-3xl font-black text-white mb-3 tracking-tight'>
                    {t.loadingTitle}
                  </h2>
                  <p className='text-purple-300/80 text-base font-mono animate-pulse uppercase tracking-wider'>
                    {t.loadingSubtitle}
                  </p>
                </div>
              )}

              {/* Notification Overlay */}
              <div className='absolute top-8 left-0 right-0 z-10 flex justify-center pointer-events-none'>
                <AnimatePresence>
                  {(notification || generationError) && (
                    <motion.div
                      initial={{ opacity: 0, y: -40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.9 }}
                      className={`
                        flex items-center rounded-2xl px-8 py-4 shadow-2xl mx-4 border border-white/20 backdrop-blur-md
                        ${
                          generationError
                            ? 'bg-red-600/90 text-white'
                            : 'bg-gradient-to-r from-emerald-500/90 to-teal-600/90 text-white'
                        }
                      `}
                    >
                      <Sparkles
                        className='mr-4 text-yellow-300 flex-shrink-0 animate-spin-slow'
                        size={28}
                      />
                      <span className='font-bold text-xl tracking-wide shadow-black drop-shadow-md'>
                        {generationError || notification}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className='absolute inset-0 overflow-auto flex items-center justify-center p-6 custom-scrollbar'>
                <Grid words={words} />
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar (Fixed Width) - Layout always assumes horizontal desktop view */}
          <div className='flex w-[400px] flex-shrink-0 flex-col gap-6 h-full'>
            {/* Streamer Camera Placeholder */}
            <CameraPlaceholder t={t} />

            {/* Leaderboard - Expanded to fill remaining space */}
            <TopPlayers userScores={userScores} t={t} />
          </div>
        </main>

        {/* SETTINGS MODAL */}
        <AnimatePresence>
          {isSettingsOpen && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4'>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className='bg-slate-900 w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col gap-6'
              >
                <div className='flex items-center justify-between border-b border-white/10 pb-4'>
                  <div className='flex items-center gap-3'>
                    <Settings className='text-purple-400' size={28} />
                    <h2 className='text-2xl font-black text-white uppercase tracking-wider'>
                      Configurações
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseSettingsWithoutSaving}
                    className='text-slate-400 hover:text-white transition-colors'
                  >
                    <X size={28} />
                  </button>
                </div>

                <div className='flex flex-col gap-6'>
                  {/* Language */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-bold text-slate-400 uppercase tracking-widest'>
                      Idioma / Language
                    </label>
                    <select
                      value={tempSettings.language}
                      onChange={(e) =>
                        setTempSettings({
                          ...tempSettings,
                          language: e.target.value as SupportedLanguage,
                        })
                      }
                      className='w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white font-bold focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all'
                    >
                      <option value='pt'>Português (PT-BR)</option>
                      <option value='en'>English (US)</option>
                      <option value='fr'>Français</option>
                      <option value='de'>Deutsch</option>
                      <option value='it'>Italiano</option>
                      <option value='es'>Español</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-bold text-slate-400 uppercase tracking-widest'>
                      Tempo da Rodada (Segundos)
                    </label>
                    <div className='flex items-center gap-4'>
                      <input
                        type='number'
                        min='30'
                        max='600'
                        value={tempSettings.duration}
                        onChange={(e) =>
                          setTempSettings({
                            ...tempSettings,
                            duration: parseInt(e.target.value) || 120,
                          })
                        }
                        className='flex-1 bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white font-mono font-bold focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all'
                      />
                      <div className='text-slate-500 font-mono text-sm'>
                        {Math.floor(tempSettings.duration / 60)}m{' '}
                        {tempSettings.duration % 60}s
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex gap-4 mt-2'>
                  <button
                    onClick={handleCloseSettingsWithoutSaving}
                    className='flex-1 py-4 rounded-xl font-bold text-slate-300 hover:bg-white/5 transition-colors uppercase tracking-widest text-sm'
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className='flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/50 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm'
                  >
                    <Save size={18} /> Salvar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* INFO MODAL */}
        <AnimatePresence>
          {isInfoOpen && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4'>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className='bg-slate-900 w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col gap-6'
              >
                <div className='flex items-center justify-between border-b border-white/10 pb-4'>
                  <div className='flex items-center gap-3'>
                    <Info className='text-cyan-400' size={28} />
                    <h2 className='text-2xl font-black text-white uppercase tracking-wider'>
                      {t.infoTitle}
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseInfo}
                    className='text-slate-400 hover:text-white transition-colors'
                  >
                    <X size={28} />
                  </button>
                </div>

                <div className='flex flex-col gap-8'>
                  {/* How to Play */}
                  <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-2 text-yellow-300'>
                      <Crown size={20} />
                      <h3 className='text-sm font-black uppercase tracking-widest'>
                        {t.howToPlay}
                      </h3>
                    </div>
                    <p className='text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5'>
                      {t.howToPlayDesc}
                    </p>
                  </div>

                  {/* Commands */}
                  <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-2 text-purple-400'>
                      <Radio size={20} />
                      <h3 className='text-sm font-black uppercase tracking-widest'>
                        {t.commands}
                      </h3>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <p className='text-xs text-slate-500 mb-1 font-mono uppercase tracking-wide'>
                        {t.cmdDesc}
                      </p>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div className='bg-slate-800/50 p-3 rounded-lg border border-white/5 flex flex-col gap-1'>
                          <span className='font-mono text-cyan-300 font-bold'>
                            !refresh
                          </span>
                          <span className='text-xs text-slate-400'>
                            Gerar novo nível
                          </span>
                        </div>
                        <div className='bg-slate-800/50 p-3 rounded-lg border border-white/5 flex flex-col gap-1'>
                          <span className='font-mono text-red-300 font-bold'>
                            !reset
                          </span>
                          <span className='text-xs text-slate-400'>
                            Zerar pontuação
                          </span>
                        </div>
                        <div className='bg-slate-800/50 p-3 rounded-lg border border-white/5 flex flex-col gap-1'>
                          <span className='font-mono text-yellow-300 font-bold'>
                            !pause
                          </span>
                          <span className='text-xs text-slate-400'>
                            Pausar tempo
                          </span>
                        </div>
                        <div className='bg-slate-800/50 p-3 rounded-lg border border-white/5 flex flex-col gap-1'>
                          <span className='font-mono text-emerald-300 font-bold'>
                            !play / !resume
                          </span>
                          <span className='text-xs text-slate-400'>
                            Retomar tempo
                          </span>
                        </div>
                        <div className='bg-slate-800/50 p-3 rounded-lg border border-white/5 flex flex-col gap-1 col-span-1 sm:col-span-2'>
                          <span className='font-mono text-orange-400 font-bold'>
                            !hint
                          </span>
                          <span className='text-xs text-slate-400'>
                            Revela uma letra (Prioridade: Interseções)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-2'>
                  <button
                    onClick={handleCloseInfo}
                    className='w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/50 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm'
                  >
                    Entendido
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game;
