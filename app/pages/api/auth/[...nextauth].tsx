import NextAuth, { NextAuthOptions } from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';
import prisma from '@/lib/prisma';
import { PlanTier, getMaxPlayersByTier } from '@/lib/stripe';

interface TwitchProfile {
  sub: string;
  preferred_username: string;
  email?: string;
  picture?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const twitchProfile = profile as TwitchProfile;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.twitchId = twitchProfile.sub;
        token.twitchLogin = twitchProfile.preferred_username;

        // Create or update user in database on sign in
        try {
          await prisma.user.upsert({
            where: { twitchId: twitchProfile.sub },
            create: {
              twitchId: twitchProfile.sub,
              twitchLogin: twitchProfile.preferred_username,
              email: twitchProfile.email,
            },
            update: {
              twitchLogin: twitchProfile.preferred_username,
              email: twitchProfile.email,
            },
          });
        } catch (error) {
          console.error('Error upserting user:', error);
        }
      }

      // Fetch subscription info on every token refresh
      if (token.twitchId) {
        try {
          const user = await prisma.user.findUnique({
            where: { twitchId: token.twitchId as string },
            include: { subscription: true },
          });

          if (user?.subscription && ['active', 'trialing'].includes(user.subscription.status)) {
            token.subscriptionTier = user.subscription.tier as PlanTier;
            token.maxPlayers = getMaxPlayersByTier(user.subscription.tier as PlanTier);
          } else {
            token.subscriptionTier = 'free';
            token.maxPlayers = 6;
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
          token.subscriptionTier = 'free';
          token.maxPlayers = 6;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.twitchId = token.twitchId as string;
      session.user.twitchLogin = token.twitchLogin as string;
      session.user.subscriptionTier = token.subscriptionTier as PlanTier;
      session.user.maxPlayers = token.maxPlayers as number;
      return session;
    },
  },
};

export default NextAuth(authOptions);
