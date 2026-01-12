import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { PLANS, PlanTier, getMaxPlayersByTier } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export interface SubscriptionStatus {
  tier: PlanTier;
  maxPlayers: number;
  status: string | null;
  currentPeriodEnd: string | null;
  plan: typeof PLANS[PlanTier];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubscriptionStatus | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.twitchId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { twitchId: session.user.twitchId },
      include: { subscription: true },
    });

    // Determine the effective tier
    let tier: PlanTier = 'free';

    if (user?.subscription) {
      const isActive = ['active', 'trialing'].includes(user.subscription.status);
      if (isActive) {
        tier = user.subscription.tier as PlanTier;
      }
    }

    const maxPlayers = getMaxPlayersByTier(tier);

    res.status(200).json({
      tier,
      maxPlayers,
      status: user?.subscription?.status || null,
      currentPeriodEnd: user?.subscription?.currentPeriodEnd?.toISOString() || null,
      plan: PLANS[tier],
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
}
