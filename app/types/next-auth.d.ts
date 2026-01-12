import 'next-auth';
import 'next-auth/jwt';
import { PlanTier } from '@/lib/stripe';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      twitchId?: string;
      twitchLogin?: string;
      subscriptionTier?: PlanTier;
      maxPlayers?: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    twitchId?: string;
    twitchLogin?: string;
    subscriptionTier?: PlanTier;
    maxPlayers?: number;
  }
}
