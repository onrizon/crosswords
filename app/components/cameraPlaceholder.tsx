import { Video } from 'lucide-react';

export const CameraPlaceholder = ({
  t,
}: {
  t: { streamOverlay: string; live: string };
}) => {
  return (
    <div className='aspect-video bg-black/80 rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl group shrink-0 ring-1 ring-white/5'>
      <div className='absolute inset-0 flex flex-col items-center justify-center text-slate-600'>
        <Video size={48} className='mb-3 opacity-50 text-purple-500/50' />
        <span className='text-sm font-mono uppercase tracking-widest opacity-50'>
          {t.streamOverlay}
        </span>
      </div>
      <div className='absolute top-4 left-4 px-3 py-1 bg-red-600/90 backdrop-blur text-white text-xs font-black rounded uppercase tracking-wider border border-red-400/50 shadow-[0_0_10px_rgba(220,38,38,0.5)]'>
        {t.live}
      </div>
    </div>
  );
};
