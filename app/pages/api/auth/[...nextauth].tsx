import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import TwitchProvider from 'next-auth/providers/twitch';

interface TwitchProfile {
  sub: string;
  preferred_username: string;
  email?: string;
  picture?: string;
}

interface DiscordProfile {
  username: string;
  id: string;
  email?: string;
  avatar?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_ID!,
      clientSecret: process.env.TWITCH_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!
    })
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        if (account.provider === 'twitch') {
          const twitchProfile = profile as TwitchProfile;
          token.refreshToken = account.refresh_token;
          token.provider = "twitch";
          token.twitchId = twitchProfile.sub;
          token.twitchLogin = twitchProfile.preferred_username;
        } else if (account.provider === 'discord') {
          const discordProfile = profile as DiscordProfile;
          token.refreshToken = account.refresh_token;
          token.provider = "discord";
          token.discordId = discordProfile.id;
          token.discordUsername = discordProfile.username;
          token.discordAvatar = discordProfile.avatar;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.provider === "twitch") {
        session.accessToken = token.accessToken as string;
        if (session.user) {
          session.user.twitchId = token.twitchId as string;
          session.user.twitchLogin = token.twitchLogin as string;
        }
      }
      else if (token.provider === "discord") {
        session.accessToken = token.accessToken as string;
        if (session.user) {
          session.user.discordId = token.discordId as string;
          session.user.discordUsername = token.discordUsername as string;
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
