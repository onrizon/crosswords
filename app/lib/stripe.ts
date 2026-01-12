import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });
  }
  return stripeInstance;
}

// For backwards compatibility
export const stripe = {
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

export type PlanTier = 'free' | 'pro' | 'unlimited';

export interface Plan {
  name: string;
  tier: PlanTier;
  maxPlayers: number;
  priceId: string | null;
  price: string;
  features: string[];
}

export const PLANS: Record<PlanTier, Plan> = {
  free: {
    name: 'Free',
    tier: 'free',
    maxPlayers: 6,
    priceId: null,
    price: 'Free',
    features: [
      'Up to 6 players',
      'Basic crossword themes',
      'Twitch chat integration',
    ],
  },
  pro: {
    name: 'Pro',
    tier: 'pro',
    maxPlayers: 12,
    priceId: process.env.STRIPE_PRICE_PRO || null,
    price: '$9.99/month',
    features: [
      'Up to 12 players',
      'All crossword themes',
      'Priority support',
      'Custom game duration',
    ],
  },
  unlimited: {
    name: 'Unlimited',
    tier: 'unlimited',
    maxPlayers: Infinity,
    priceId: process.env.STRIPE_PRICE_UNLIMITED || null,
    price: '$19.99/month',
    features: [
      'Unlimited players',
      'All Pro features',
      'Custom themes',
      'Analytics dashboard',
      'API access',
    ],
  },
};

export function getPlanByPriceId(priceId: string): Plan | undefined {
  return Object.values(PLANS).find((plan) => plan.priceId === priceId);
}

export function getTierByPriceId(priceId: string): PlanTier {
  const plan = getPlanByPriceId(priceId);
  return plan?.tier || 'free';
}

export function getMaxPlayersByTier(tier: PlanTier): number {
  return PLANS[tier]?.maxPlayers || 6;
}
