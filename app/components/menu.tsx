import {
  Info,
  Loader2,
  LogOut,
  Pause,
  Play,
  RefreshCw,
  Settings,
} from 'lucide-react';

export const Menu = ({
  isPaused,
  isLoading,
  isSettingsOpen,
  isInfoOpen,
  handleOpenSettings,
  handleOpenInfo,
  handleLogout,
  handlePause,
  handleNextLevel,
}: {
  isLoading: boolean;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isInfoOpen: boolean;
  handleOpenSettings: () => void;
  handleOpenInfo: () => void;
  handleLogout: () => void;
  handlePause: () => void;
  handleNextLevel: () => void;
}) => {
  return (
    <div className='flex items-center gap-2'>
      <button
        onClick={handlePause}
        disabled={isSettingsOpen || isInfoOpen}
        className='p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white active:scale-95 disabled:opacity-30'
        title={isPaused ? 'Retomar' : 'Pausar'}
      >
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>
      <button
        onClick={handleNextLevel}
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
  );
};
