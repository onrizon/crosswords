import { signIn, signOut, useSession } from 'next-auth/react';

export const useTwitchAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const loginWithTwitch = (callbackUrl: string = '/system') => {
    signIn('twitch', { callbackUrl });
  };

  const logout = (callbackUrl: string = '/') => {
    signOut({ callbackUrl });
  };

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user: session?.user,
    accessToken: session?.accessToken,
    twitchId: session?.user?.twitchId,
    twitchLogin: session?.user?.twitchLogin,
    loginWithTwitch,
    logout,
  };
};
