import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

// Disable body parsing, need raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Determine tier from price ID
function getTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  if (priceId === process.env.STRIPE_PRICE_UNLIMITED) return 'unlimited';
  return 'free';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  console.log('Webhook event received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        console.log('Session metadata:', session.metadata);

        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const subscription = subscriptionResponse as unknown as Stripe.Subscription;

          const priceId = subscription.items.data[0]?.price.id;
          const tier = getTierFromPriceId(priceId);
          const userId = session.metadata?.userId;
          const currentPeriodEnd = (subscription as { current_period_end?: number }).current_period_end;

          console.log('Subscription details:', {
            priceId,
            tier,
            userId,
            currentPeriodEnd,
            subscriptionId: subscription.id,
            status: subscription.status,
          });

          if (!userId) {
            console.error('No userId in session metadata!');
            break;
          }

          if (!currentPeriodEnd) {
            console.error('No currentPeriodEnd in subscription!');
            break;
          }

          // Check if user exists
          const user = await prisma.user.findUnique({ where: { id: userId } });
          console.log('User found:', user);

          if (!user) {
            console.error('User not found in database:', userId);
            break;
          }

          const result = await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              tier,
              status: subscription.status,
              currentPeriodEnd: new Date(currentPeriodEnd * 1000),
            },
            update: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              tier,
              status: subscription.status,
              currentPeriodEnd: new Date(currentPeriodEnd * 1000),
            },
          });
          console.log('Subscription upserted:', result);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const tier = getTierFromPriceId(priceId);
        const currentPeriodEnd = (subscription as { current_period_end?: number }).current_period_end;

        console.log('Subscription updated:', subscription.id);

        if (currentPeriodEnd) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripePriceId: priceId,
              tier,
              status: subscription.status,
              currentPeriodEnd: new Date(currentPeriodEnd * 1000),
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscription.id);

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'canceled',
          },
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as { subscription?: string | null }).subscription;
        console.log('Invoice payment failed:', subscriptionId);

        if (subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              status: 'past_due',
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
