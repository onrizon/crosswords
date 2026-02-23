import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      twitchId?: string;
      twitchLogin?: string;
      discordId?: string;
      discordUsername?: string;
      discordAvatar?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    twitchId?: string;
    twitchLogin?: string;
    discordId?: string;
    discordUsername?: string;
    discordAvatar?: string;
  }
}
