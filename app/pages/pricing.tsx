import { PLANS, PlanTier } from '@/lib/stripe';
import styles from '@/styles/Pricing.module.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface SubscriptionData {
  tier: PlanTier;
  maxPlayers: number;
  status: string | null;
  currentPeriodEnd: string | null;
}

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<PlanTier | null>(null);

  const { checkout } = router.query;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchSubscription();
    }
  }, [status, router]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/stripe/status');
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tier: PlanTier) => {
    if (tier === 'free' || checkoutLoading) return;

    setCheckoutLoading(tier);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to create checkout session');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/manage-billing', {
        method: 'POST',
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to open billing portal');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const currentTier = subscription?.tier || 'free';
  const plans = Object.values(PLANS);

  return (
    <div className={styles.container}>
      <Link href="/game" className={styles.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Game
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>Choose Your Plan</h1>
        <p className={styles.subtitle}>Unlock more players and features for your stream</p>
      </header>

      {checkout === 'success' && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          Successfully subscribed! Your new plan is now active.
        </div>
      )}

      {checkout === 'canceled' && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          Checkout was canceled. Feel free to try again when you&apos;re ready.
        </div>
      )}

      <div className={styles.grid}>
        {plans.map((plan) => {
          const isCurrentPlan = currentTier === plan.tier;
          const isPopular = plan.tier === 'pro';

          return (
            <div
              key={plan.tier}
              className={`${styles.card} ${isCurrentPlan ? styles.cardActive : ''} ${isPopular ? styles.cardPopular : ''}`}
            >
              {isPopular && <span className={styles.popularBadge}>Most Popular</span>}

              <h2 className={styles.planName}>{plan.name}</h2>
              <div className={styles.planPrice}>
                {plan.price === 'Free' ? (
                  'Free'
                ) : (
                  <>
                    {plan.price.replace('/month', '')}
                    <span>/month</span>
                  </>
                )}
              </div>
              <p className={styles.playerLimit}>
                {plan.maxPlayers === Infinity ? 'Unlimited' : `Up to ${plan.maxPlayers}`} players
              </p>

              <ul className={styles.features}>
                {plan.features.map((feature, index) => (
                  <li key={index} className={styles.feature}>
                    <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <button className={`${styles.button} ${styles.currentPlan}`} disabled>
                  Current Plan
                </button>
              ) : plan.tier === 'free' ? (
                <button className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonDisabled}`} disabled>
                  Default Plan
                </button>
              ) : (
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={!!checkoutLoading}
                >
                  {checkoutLoading === plan.tier ? 'Loading...' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {currentTier !== 'free' && (
        <div className={styles.manageSection}>
          <button className={styles.manageButton} onClick={handleManageBilling}>
            Manage Billing & Subscription
          </button>
        </div>
      )}
    </div>
  );
}
