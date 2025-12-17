import { SupportedLanguage } from '@/types';
import { motion } from 'framer-motion';
import { Save, Settings, X } from 'lucide-react';

export const SettingsModal = ({
  handleCloseSettingsWithoutSaving,
  handleSaveSettings,
  tempSettings,
  setTempSettings,
}: {
  handleCloseSettingsWithoutSaving: () => void;
  handleSaveSettings: () => void;
  tempSettings: {
    language: SupportedLanguage;
    duration: number;
    webhookUrl: string;
  };
  setTempSettings: (settings: {
    language: SupportedLanguage;
    duration: number;
    webhookUrl: string;
  }) => void;
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
  );
};
