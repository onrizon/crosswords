import { WordData } from '@/types';
import {
  Clock,
  Info,
  LayoutGrid,
  Loader2,
  LogOut,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { Session } from 'next-auth';

export const Header = (
  words: WordData,
  session: Session,
  status: string,
  t: {
    live: string;
    offline: string;
    generating: string;
    time: string;
    progress: string;
    topPlayers: string;
    chatTitle: string;
    waitingForMessages: string;
    correct: string;
    guessed: string;
    levelComplete: string;
    newTheme: string;
    loadingTitle: string;
    loadingSubtitle: string;
    beFirst: string;
    streamOverlay: string;
    infoTitle: string;
    howToPlay: string;
    howToPlayDesc: string;
    commands: string;
    cmdDesc: string;
  },
  isLoading: boolean,
  language: string,
  currentTheme: string,
  getThemeStyle: (text: string) => string
) => {
  if (!Array.isArray(words)) {
    throw new Error("Expected 'words' to be an array.");
  }
  const solvedCount = (words as WordData[]).filter(
    (w: WordData) => w.isRevealed
  ).length;
  const totalCount = (words as WordData[]).length;
  const progress =
    totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
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
      <div className='flex-1 h-full flex flex-col items-center justify-center px-4 bg-white/[0.02] relative group overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50' />
        <span className='text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-1 relative z-10 shrink-0'>
          {language === 'pt' ? 'TEMA ATUAL' : 'CURRENT THEME'}
        </span>
        <div className='w-full flex items-center justify-center relative z-10 h-20 px-4'>
          <h2
            className={`${getThemeStyle(
              currentTheme
            )} font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-100 drop-shadow-md tracking-tight text-center uppercase break-words w-full flex items-center justify-center`}
          >
            {isLoading ? (
              <span className='animate-pulse opacity-70 text-3xl'>
                {t.generating}
              </span>
            ) : (
              currentTheme
            )}
          </h2>
        </div>
      </div>

      {/* SECTION 3: TIME & OPTIONS (Fixed Width ~500px) */}
      <div className='w-[480px] h-full flex items-center justify-between px-8 border-l border-white/5 bg-black/20'>
        {/* Timer */}
        <div className='flex items-center gap-4'>
          <Clock
            size={28}
            className={
              timeLeft < 30 && !isPaused && !isSettingsOpen && !isInfoOpen
                ? 'text-red-500 animate-pulse'
                : 'text-cyan-400'
            }
          />
          <div className='flex flex-col w-20'>
            <span
              className={`text-4xl font-mono font-bold leading-none ${
                timeLeft < 30 && !isPaused && !isSettingsOpen && !isInfoOpen
                  ? 'text-red-400'
                  : 'text-white'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
            <span className='text-[10px] text-slate-500 uppercase font-bold tracking-widest'>
              {t.time}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className='w-px h-12 bg-white/10' />

        {/* Buttons Grid */}
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setIsPaused(!isPaused)}
            disabled={isSettingsOpen || isInfoOpen}
            className='p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white active:scale-95 disabled:opacity-30'
            title={isPaused ? 'Retomar' : 'Pausar'}
          >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
          </button>
          <button
            onClick={() => handleNextLevel()}
            disabled={isLoading || isSettingsOpen || isInfoOpen}
            className='p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white disabled:opacity-50 active:scale-95'
            title='Gerar Novo Nível'
          >
            {isLoading ? (
              <Loader2 size={24} className='animate-spin text-purple-400' />
            ) : (
              <RefreshCw size={24} />
            )}
          </button>
          <button
            onClick={handleOpenSettings}
            disabled={isLoading || isInfoOpen}
            className='p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white disabled:opacity-50 active:scale-95'
            title='Configurações'
          >
            <Settings size={24} />
          </button>
          <button
            onClick={handleOpenInfo}
            disabled={isLoading || isSettingsOpen}
            className='p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white disabled:opacity-50 active:scale-95'
            title='Ajuda / Comandos'
          >
            <Info size={24} />
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoading || isSettingsOpen}
            className='p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white disabled:opacity-50 active:scale-95'
            title='Ajuda / Comandos'
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      {/* SECTION 4: PROGRESS (Fixed Width ~240px) */}
      <div className='w-[240px] h-full flex items-center justify-center gap-6 px-8 border-l border-white/5 bg-black/40'>
        <div className='flex flex-col items-end'>
          <span className='text-[10px] text-slate-500 font-bold uppercase tracking-wider'>
            {t.progress}
          </span>
          <span className='text-2xl font-black text-white leading-none'>
            {solvedCount}
            <span className='text-slate-600 text-lg mx-1'>/</span>
            {totalCount}
          </span>
        </div>
        <div className='relative w-14 h-14'>
          <svg
            className='w-full h-full transform -rotate-90 drop-shadow-lg overflow-visible'
            viewBox='0 0 96 96'
          >
            <circle
              cx='48'
              cy='48'
              r='36'
              stroke='currentColor'
              strokeWidth='10'
              className='text-slate-800/80'
              fill='none'
            />
            <circle
              cx='48'
              cy='48'
              r='36'
              stroke='currentColor'
              strokeWidth='10'
              className='text-purple-500 transition-all duration-1000 ease-out'
              fill='none'
              strokeDasharray='226.2'
              strokeDashoffset={226.2 - (226.2 * progress) / 100}
              strokeLinecap='round'
            />
          </svg>
          <span className='absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-200'>
            {progress}%
          </span>
        </div>
      </div>
    </header>
  );
};
