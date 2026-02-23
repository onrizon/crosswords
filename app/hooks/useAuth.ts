import { signIn, signOut, useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const loginWithTwitch = (callbackUrl: string = '/mobile/system') => {
    signIn('twitch', { callbackUrl });
  };

  const loginWithDiscord = (callbackUrl: string = '/mobile/system') => {
    signIn('discord', { callbackUrl });
  };

  const logout = (callbackUrl: string = '/mobile') => {
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
    discordId: session?.user?.discordId,
    discordUsername: session?.user?.discordUsername,
    loginWithTwitch,
    loginWithDiscord,
    logout,
  };
};
