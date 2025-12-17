export const ThemeText = ({
  currentTheme,
  isLoading,
  language,
  t,
}: {
  currentTheme: string;
  isLoading: boolean;
  language: string;
  t: string;
}) => {
  const getThemeStyle = (text: string) => {
    const length = text.length;
    // Removed responsive classes (md:, lg:) to enforce fixed Desktop size
    if (length > 35) return 'text-2xl leading-tight line-clamp-2';
    if (length > 20) return 'text-4xl leading-tight line-clamp-2';
    return 'text-5xl leading-none';
  };

  return (
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
            <span className='animate-pulse opacity-70 text-3xl'>{t}</span>
          ) : (
            currentTheme
          )}
        </h2>
      </div>
    </div>
  );
};
