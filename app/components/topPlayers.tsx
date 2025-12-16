import { UserScores } from '@/types';
import { Crown, Trophy } from 'lucide-react';

export const TopPlayers = ({
  userScores,
  t,
}: {
  userScores: UserScores;
  t: { topPlayers: string; beFirst: string };
}) => {
  const topScorers = Object.entries(userScores).sort(
    ([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number)
  );

  return (
    <div className='flex-1 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col gap-4 shadow-xl overflow-hidden min-h-0'>
      <div className='flex items-center gap-3 border-b border-white/10 pb-4 shrink-0'>
        <Trophy size={24} className='text-yellow-400' />
        <h3 className='text-base font-black uppercase tracking-widest text-slate-300'>
          {t.topPlayers}
        </h3>
      </div>
      <div className='flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar'>
        {topScorers.length === 0 ? (
          <div className='text-base text-slate-500 italic text-center py-8'>
            {t.beFirst}
          </div>
        ) : (
          topScorers.map(([user, score], index) => (
            <div
              key={user}
              className='flex items-center justify-between text-lg group p-2 rounded-xl hover:bg-white/5 transition-colors'
            >
              <div className='flex items-center gap-4'>
                <div
                  className={`
                             w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold shadow-lg
                             ${
                               index === 0
                                 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950 ring-1 ring-yellow-300/50'
                                 : index === 1
                                 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900 ring-1 ring-slate-300/50'
                                 : index === 2
                                 ? 'bg-gradient-to-br from-orange-300 to-orange-600 text-orange-950 ring-1 ring-orange-300/50'
                                 : 'bg-slate-800 text-slate-500'
                             }
                           `}
                >
                  {index + 1}
                </div>
                <span
                  className={`font-bold ${
                    index === 0 ? 'text-yellow-200' : 'text-slate-300'
                  }`}
                >
                  {user}{' '}
                  {index === 0 && (
                    <Crown size={16} className='inline ml-1 text-yellow-400' />
                  )}
                </span>
              </div>
              <span className='font-mono font-bold text-emerald-400 drop-shadow-sm'>
                {score}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
