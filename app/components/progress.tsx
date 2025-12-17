import { WordData } from '@/types';

export const Progress = ({ words, t }: { words: WordData[]; t: string }) => {
  const solvedCount = words.filter((w) => w.isRevealed).length;
  const totalCount = words.length;
  const progress =
    totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className='w-[240px] h-full flex items-center justify-center gap-6 px-8 border-l border-white/5 bg-black/40'>
      <div className='flex flex-col items-end'>
        <span className='text-[10px] text-slate-500 font-bold uppercase tracking-wider'>
          {t}
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
  );
};
