import { Clock } from 'lucide-react';

export const Timer = ({
  timeLeft,
  isPaused,
  isSettingsOpen,
  isInfoOpen,
  t,
}: {
  timeLeft: number;
  isPaused: boolean;
  isSettingsOpen: boolean;
  isInfoOpen: boolean;
  t: string;
}) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
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
          {t}
        </span>
      </div>
    </div>
  );
};
