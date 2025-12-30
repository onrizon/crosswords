import NextAuth, { NextAuthOptions } from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';

interface TwitchProfile {
  sub: string;
  preferred_username: string;
  email?: string;
  picture?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_ID!,
      clientSecret: process.env.TWITCH_SECRET!,
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const twitchProfile = profile as TwitchProfile;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.twitchId = twitchProfile.sub;
        token.twitchLogin = twitchProfile.preferred_username;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.twitchId = token.twitchId as string;
      session.user.twitchLogin = token.twitchLogin as string;
      return session;
    },
  },
};

export default NextAuth(authOptions);
