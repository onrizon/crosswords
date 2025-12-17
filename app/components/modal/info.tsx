import { motion } from 'framer-motion';
import { Crown, Info, Radio, X } from 'lucide-react';

export const InfoModal = ({
  handleCloseInfo,
  t,
}: {
  handleCloseInfo: () => void;
  t: {
    infoTitle: string;
    howToPlay: string;
    howToPlayDesc: string;
    commands: string;
    cmdDesc: string;
  };
}) => {
  return (
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
                  <span className='text-xs text-slate-400'>Pausar tempo</span>
                </div>
                <div className='bg-slate-800/50 p-3 rounded-lg border border-white/5 flex flex-col gap-1'>
                  <span className='font-mono text-emerald-300 font-bold'>
                    !play / !resume
                  </span>
                  <span className='text-xs text-slate-400'>Retomar tempo</span>
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
  );
};
