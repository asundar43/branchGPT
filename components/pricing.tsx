'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { BackgroundBranches } from './background-branches';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const features = [
  'Unlimited branching conversations',
  'Advanced AI models with memory',
  'Branch and merge chat threads',
  'Export and share conversations',
  'Custom AI personality settings',
  'Priority support & updates',
];

const tiers = [
  {
    name: 'Monthly',
    id: 'monthly',
    price: { monthly: '$20' },
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    description: 'Flexible monthly access to BranchGPT',
    features,
  },
  {
    name: 'Annual',
    id: 'annual',
    price: { monthly: '$16', annual: '$192' },
    priceId: process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID,
    description: 'Best value for power users',
    features,
  },
];

export function Pricing() {
  const { data: session } = useSession();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    if (!session?.user?.id) {
      console.error('No user ID found');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Sending request with:', { priceId, userId: session.user.id });
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: session.user.id,
        }),
      });

      const data = await response.json();
      console.log('Server response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (!data.sessionId) {
        throw new Error('No session ID received from server');
      }

      const stripe = await stripePromise;

      if (!stripe) throw new Error('Stripe failed to initialize');

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative isolate">
      <BackgroundBranches />
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Unlock the Power of Branching
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Explore infinite possibilities
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Branch, explore, and merge conversations with BranchGPT. Never lose a train of thought again.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="relative self-center rounded-full bg-muted p-1">
              <div className="flex">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`${
                    !isAnnual ? 'bg-background text-foreground shadow' : 'text-muted-foreground'
                  } relative w-full rounded-full py-2.5 px-6 text-sm font-semibold leading-5 transition-colors`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`${
                    isAnnual ? 'bg-background text-foreground shadow' : 'text-muted-foreground'
                  } relative w-full rounded-full py-2.5 px-6 text-sm font-semibold leading-5 transition-colors flex items-center justify-center gap-2`}
                >
                  Annual
                  <span className="text-xs font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                onClick={() => setIsAnnual(tier.id === 'annual')}
                className={`flex flex-col justify-between backdrop-blur-sm bg-card/80 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  tier.id === 'annual' && isAnnual
                    ? 'ring-2 ring-primary shadow-lg shadow-indigo-500/10'
                    : tier.id === 'monthly' && !isAnnual
                    ? 'ring-2 ring-primary shadow-lg shadow-indigo-500/10'
                    : 'hover:border-primary/50'
                }`}
              >
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4 flex flex-col">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold tracking-tight">
                        {tier.price.monthly}
                      </span>
                      <span className="ml-1 text-sm font-semibold leading-6 text-muted-foreground">
                        /month
                      </span>
                    </div>
                    {tier.id === 'annual' && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isAnnual ? 'Billed annually at $192' : 'Switch to annual to save 20%'}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <div className="flex-none">
                          <div className="h-5 w-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                          </div>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      (tier.id === 'annual' && isAnnual) || (tier.id === 'monthly' && !isAnnual)
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0'
                        : ''
                    }`}
                    variant={tier.id === 'annual' && isAnnual || tier.id === 'monthly' && !isAnnual ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tier.priceId) {
                        handleSubscribe(tier.priceId);
                      } else {
                        console.error('Price ID not found for tier:', tier.id);
                      }
                    }}
                    disabled={isLoading || !session?.user?.id}
                  >
                    {isLoading ? 'Loading...' : 'Start branching'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 