import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { stripe, PLANS, PlanTier } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.twitchId || !session?.user?.twitchLogin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { twitchId, twitchLogin } = session.user;
    const { tier } = req.body as { tier: PlanTier };

    if (!tier || !PLANS[tier]) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    const plan = PLANS[tier];

    if (!plan.priceId) {
      return res.status(400).json({ error: 'This tier does not require payment' });
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { twitchId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          twitchId,
          twitchLogin,
        },
      });
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          twitchId,
          twitchLogin,
          userId: user.id,
        },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/game?checkout=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?checkout=canceled`,
      metadata: {
        tier,
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          tier,
          userId: user.id,
        },
      },
    });

    res.status(200).json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
