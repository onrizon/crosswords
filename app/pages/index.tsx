import { useTwitchAuth } from '@/hooks/useTwitchAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const App: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, loginWithTwitch } = useTwitchAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/game');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-gray-900'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-8 bg-gray-900'>
      <h1 className='text-4xl font-bold text-white'>Crosswords</h1>
      <p className='text-gray-400 text-lg'>Sign in to start playing</p>

      <button
        onClick={() => loginWithTwitch()}
        className='flex items-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl'
      >
        <svg
          className='w-6 h-6'
          viewBox='0 0 24 24'
          fill='currentColor'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z' />
        </svg>
        Login with Twitch
      </button>
    </div>
  );
};

export default App;
