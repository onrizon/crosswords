
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CHANNEL_NAME, FALLBACK_WORDS, UI_TEXT } from './constants';
import { WordData, UserScores, SupportedLanguage } from './types';
import Grid from './components/Grid';
import { useTwitch } from './hooks/useTwitch';
import { Trophy, Radio, LayoutGrid, Sparkles, Video, Crown, Clock, Loader2, RefreshCw, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTopicAndWords } from './services/genai';
import { generateLayout } from './services/layoutEngine';

const LEVEL_DURATION = 120; // 2 minutes

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('ESCRITORIO');
  const [words, setWords] = useState<WordData[]>(FALLBACK_WORDS);
  const [timeLeft, setTimeLeft] = useState(LEVEL_DURATION);
  const [isLoading, setIsLoading] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [lastCorrectUser, setLastCorrectUser] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [userScores, setUserScores] = useState<UserScores>({});

  // Language State
  const [language, setLanguage] = useState<SupportedLanguage>('pt');

  // Layout Scaling for 1920x1080
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = UI_TEXT[language];

  useEffect(() => {
    const handleResize = () => {
      // Only apply fixed scaling logic on larger screens (desktop behavior)
      if (window.innerWidth >= 1024) {
        const targetWidth = 1920;
        const targetHeight = 1080;
        const scaleX = window.innerWidth / targetWidth;
        const scaleY = window.innerHeight / targetHeight;
        // Fit contained
        setScale(Math.min(scaleX, scaleY)); 
      } else {
        setScale(1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sound effect helper (optional)
  const playSuccessSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const loadNewLevel = useCallback(async (targetLang?: SupportedLanguage) => {
    setIsLoading(true);
    setGenerationError(null);
    const langToUse = targetLang || language;

    try {
      // 1. Fetch data from AI
      const data = await generateTopicAndWords(langToUse);
      
      // 2. Compute Layout
      const validLayout = generateLayout(data.words);
      
      if (validLayout.length < 5) {
        throw new Error("Could not generate a valid grid structure. Try again.");
      }

      setWords(validLayout);
      setCurrentTheme(data.theme);
      setTimeLeft(LEVEL_DURATION);
      setNotification(`${UI_TEXT[langToUse].newTheme}: ${data.theme}!`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setGenerationError("Erro ao gerar nível. Tentando novamente...");
      // Optionally retry automatically or leave error state
      setTimeout(() => loadNewLevel(langToUse), 2000); 
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as SupportedLanguage;
    setLanguage(newLang);
    loadNewLevel(newLang);
  };

  // Initial load
  useEffect(() => {
    // Only load if we are on the fallback/default state to avoid double load on strict mode
    if (currentTheme === 'ESCRITORIO' && words === FALLBACK_WORDS) {
       loadNewLevel();
    }
  }, []);

  const handleNextLevel = useCallback(() => {
    loadNewLevel();
  }, [loadNewLevel]);

  // Timer Effect
  useEffect(() => {
    if (isLoading) return;

    if (timeLeft <= 0) {
       handleNextLevel();
       return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleNextLevel, isLoading]);

  // Check for level completion
  useEffect(() => {
    const allSolved = words.every(w => w.isRevealed);
    if (allSolved && words.length > 0 && !isLoading) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#f59e0b']
      });
      setNotification(t.levelComplete);
      const timeout = setTimeout(() => {
        handleNextLevel();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [words, handleNextLevel, isLoading, t.levelComplete]);

  const handleTwitchMessage = useCallback((username: string, message: string) => {
    if (isLoading) return;

    const cleanMessage = message.trim().toUpperCase()
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
        setLastCorrectUser(username);
        setNotification(`${username} ${t.guessed} ${cleanMessage}!`);
        
        setUserScores(prev => ({
          ...prev,
          [username]: (prev[username] || 0) + 100
        }));

        playSuccessSound();
        setTimeout(() => setNotification(null), 3000);
      }

      return newWords;
    });
  }, [isLoading, t.guessed]);

  // We still use the hook to receive messages for gameplay, but we don't display the chat log
  const { status } = useTwitch({ onMessage: handleTwitchMessage });

  const solvedCount = words.filter(w => w.isRevealed).length;
  const totalCount = words.length;
  const progress = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Sorting logic for leaderboard
  const topScorers = Object.entries(userScores)
    .sort(([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number));
    // Removed slice to show more players now that we have space

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      <div 
        ref={containerRef}
        className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-slate-950 text-slate-100 flex flex-col items-center py-6 px-8 gap-6 font-sans overflow-hidden selection:bg-purple-500 selection:text-white shadow-2xl origin-center"
        style={{
          width: window.innerWidth >= 1024 ? '1920px' : '100%',
          height: window.innerWidth >= 1024 ? '1080px' : '100%',
          transform: window.innerWidth >= 1024 ? `scale(${scale})` : 'none',
        }}
      >
        
        {/* Header */}
        <header className="flex-shrink-0 w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl z-20 relative">
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-900/50 ring-1 ring-white/20">
                <LayoutGrid size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 drop-shadow-sm tracking-tight leading-tight">
                  CRUZADINHA.AI
                </h1>
                <div className="flex items-center gap-4 text-slate-300 text-base font-bold font-mono uppercase tracking-wider mt-1">
                   <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                     <Radio size={14} className={status === 'connected' ? 'text-emerald-400 animate-pulse' : 'text-red-500'} />
                     <span className={status === 'connected' ? 'text-emerald-400' : 'text-red-400'}>{status === 'connected' ? t.live : t.offline}</span>
                   </div>
                   <span className="text-slate-600">/</span>
                   <span className="text-purple-300 font-extrabold truncate max-w-[350px] text-xl">{isLoading ? t.generating : currentTheme.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Language & Timer */}
          <div className="flex items-center gap-6">
             
             {/* Language Selector */}
             <div className="flex items-center gap-2 bg-black/40 pl-3 pr-2 py-2 rounded-xl border border-white/5">
                <Globe size={18} className="text-slate-400" />
                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  disabled={isLoading}
                  className="bg-transparent text-white font-bold text-sm uppercase outline-none cursor-pointer hover:text-purple-300 transition-colors [&>option]:bg-slate-900 [&>option]:text-white"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="es">Español</option>
                </select>
             </div>

             {/* Timer Display */}
             <div className="flex items-center gap-8 bg-black/40 px-8 py-4 rounded-2xl border border-white/5 shadow-inner">
               <Clock size={32} className={timeLeft < 30 ? "text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "text-cyan-400"} />
               <div className="flex flex-col items-center w-28">
                  <span className={`text-4xl font-mono font-bold leading-none ${timeLeft < 30 ? "text-red-400" : "text-white"} drop-shadow-md`}>
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">{t.time}</span>
               </div>
               <button 
                 onClick={handleNextLevel}
                 disabled={isLoading}
                 className="ml-4 p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white disabled:opacity-50 active:scale-95"
                 title="Gerar Novo Nível"
               >
                 {isLoading ? <Loader2 size={28} className="animate-spin text-purple-400" /> : <RefreshCw size={28} />}
               </button>
            </div>
          </div>


          <div className="flex items-center gap-10 hidden sm:flex pr-6">
             <div className="text-right">
                <div className="text-sm text-slate-400 uppercase tracking-widest mb-1 font-bold">{t.progress}</div>
                <div className="text-4xl font-black font-mono tracking-tight text-white">{solvedCount}<span className="text-slate-500 text-2xl">/</span>{totalCount}</div>
             </div>
             
             <div className="relative w-24 h-24 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90 drop-shadow-lg overflow-visible" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="10" className="text-slate-800/80" fill="none" />
                  <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="10" className="text-purple-500 transition-all duration-1000 ease-out" 
                    fill="none" 
                    strokeDasharray="226.2" 
                    strokeDashoffset={226.2 - (226.2 * progress) / 100} 
                    strokeLinecap="round"
                  />
               </svg>
               <span className="absolute text-lg font-bold text-purple-200">{progress}%</span>
             </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <main className="w-full flex-1 flex flex-col lg:flex-row gap-8 items-start min-h-0 overflow-hidden">
          
          {/* LEFT: Game Area (Flexible) */}
          <div className="flex-1 flex flex-col gap-6 w-full h-full overflow-hidden">
            
            <div className="flex-1 flex flex-col justify-center overflow-hidden relative border border-white/10 rounded-3xl bg-slate-900/40 backdrop-blur-sm shadow-2xl">
               
               {/* Loading Overlay */}
               {isLoading && (
                 <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center">
                   <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                      <Loader2 size={80} className="text-purple-500 animate-spin mb-8 relative z-10" />
                   </div>
                   <h2 className="text-3xl font-black text-white mb-3 tracking-tight">{t.loadingTitle}</h2>
                   <p className="text-purple-300/80 text-base font-mono animate-pulse uppercase tracking-wider">{t.loadingSubtitle}</p>
                 </div>
               )}

               {/* Notification Overlay */}
               <div className="absolute top-8 left-0 right-0 z-10 flex justify-center pointer-events-none">
                  <AnimatePresence>
                  {(notification || generationError) && (
                    <motion.div 
                      initial={{ opacity: 0, y: -40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 0.9 }}
                      className={`
                        flex items-center rounded-2xl px-8 py-4 shadow-2xl mx-4 border border-white/20 backdrop-blur-md
                        ${generationError 
                          ? 'bg-red-600/90 text-white' 
                          : 'bg-gradient-to-r from-emerald-500/90 to-teal-600/90 text-white'}
                      `}
                    >
                       <Sparkles className="mr-4 text-yellow-300 flex-shrink-0 animate-spin-slow" size={28} />
                       <span className="font-bold text-xl tracking-wide shadow-black drop-shadow-md">{generationError || notification}</span>
                    </motion.div>
                  )}
                  </AnimatePresence>
               </div>

               <div className="absolute inset-0 overflow-auto flex items-center justify-center p-6 custom-scrollbar">
                  <Grid words={words} />
               </div>
            </div>
          </div>

          {/* RIGHT: Sidebar (Fixed Width) - Hidden on Mobile, wide on Desktop */}
          <div className="hidden lg:flex w-[400px] flex-shrink-0 flex-col gap-6 h-full">
             
             {/* Streamer Camera Placeholder */}
             <div className="aspect-video bg-black/80 rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl group shrink-0 ring-1 ring-white/5">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                  <Video size={48} className="mb-3 opacity-50 text-purple-500/50" />
                  <span className="text-sm font-mono uppercase tracking-widest opacity-50">{t.streamOverlay}</span>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-600/90 backdrop-blur text-white text-xs font-black rounded uppercase tracking-wider border border-red-400/50 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  {t.live}
                </div>
             </div>

             {/* Leaderboard - Expanded to fill remaining space */}
             <div className="flex-1 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col gap-4 shadow-xl overflow-hidden min-h-0">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 shrink-0">
                  <Trophy size={24} className="text-yellow-400" />
                  <h3 className="text-base font-black uppercase tracking-widest text-slate-300">{t.topPlayers}</h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {topScorers.length === 0 ? (
                    <div className="text-base text-slate-500 italic text-center py-8">{t.beFirst}</div>
                  ) : (
                    topScorers.map(([user, score], index) => (
                      <div key={user} className="flex items-center justify-between text-lg group p-2 rounded-xl hover:bg-white/5 transition-colors">
                         <div className="flex items-center gap-4">
                           <div className={`
                             w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold shadow-lg
                             ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950 ring-1 ring-yellow-300/50' : 
                               index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900 ring-1 ring-slate-300/50' :
                               index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-600 text-orange-950 ring-1 ring-orange-300/50' : 
                               'bg-slate-800 text-slate-500'}
                           `}>
                             {index + 1}
                           </div>
                           <span className={`font-bold ${index === 0 ? 'text-yellow-200' : 'text-slate-300'}`}>
                             {user} {index === 0 && <Crown size={16} className="inline ml-1 text-yellow-400" />}
                           </span>
                         </div>
                         <span className="font-mono font-bold text-emerald-400 drop-shadow-sm">{score}</span>
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
