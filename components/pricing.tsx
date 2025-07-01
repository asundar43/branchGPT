'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { BackgroundBranches } from './background-branches';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const features = [
  'Unlimited branching conversations',
  'Advanced AI models with memory',
  'Branch and merge chat threads',
  'Export and share conversations',
  'Custom AI personality settings',
  'Priority support & updates',
];

const freeTrialFeatures = [
  'Limited to 10 chats per day',
  'Basic AI models only',
  'No custom AI settings',
  'No priority support',
  'Trial expires in 14 days',
];

const tiers = [
  {
    name: 'Free Trial',
    id: 'trial',
    price: { monthly: '$0' },
    description: 'Limited access to try BranchGPT',
    features: freeTrialFeatures,
    isTrial: true,
  },
  {
    name: 'Monthly',
    id: 'monthly',
    price: { monthly: '$10', original: '$20' },
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    description: 'Full access to BranchGPT',
    features,
    discount: '50% OFF',
    originalAnnual: '$20',
  },
  {
    name: 'Annual',
    id: 'annual',
    price: { monthly: '$8', annual: '$96', originalMonthly: '$16', originalAnnual: '$192' },
    priceId: process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID,
    description: 'Best value for power users',
    features,
    isPopular: true,
    discount: '50% OFF',
  },
];

export function Pricing() {
  const { data: session, status } = useSession();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Add loading state for session
  const isSessionLoading = status === 'loading';

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

  const handleStartTrial = async () => {
    try {
      setIsLoading(true);
      // Twitter conversion tracking event code
      if (typeof window !== 'undefined' && (window as any).twq) {
        (window as any).twq('event', 'tw-pcm26-pcm26', {});
      }
      const response = await fetch('/api/free-trial/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'You already have an active paid subscription') {
          toast({
            type: 'error',
            description: 'You already have an active paid subscription. Please use your subscription features.',
          });
          router.push('/chat');
          return;
        }
        if (data.error === 'You already have an active free trial') {
          toast({
            type: 'success',
            description: 'You already have an active free trial. Returning to chat...',
          });
          router.push('/chat');
          return;
        }
        if (data.error === 'Your free trial has expired') {
          toast({
            type: 'error',
            description: 'Your free trial has expired. Please upgrade to continue using all features.',
          });
          return;
        }
        throw new Error(data.error || 'Failed to start free trial');
      }

      toast({
        type: 'success',
        description: 'Free trial started successfully!',
      });

      router.push('/chat');
      router.refresh();
    } catch (error) {
      console.error('Error starting free trial:', error);
      toast({
        type: 'error',
        description: error instanceof Error ? error.message : 'Failed to start free trial. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative isolate">
      <BackgroundBranches />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 z-50 rounded-full h-8 w-8 transition-all duration-200 hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 hover:text-white"
        onClick={() => router.push('/chat')}
      >
        <X className="h-4 w-4" />
      </Button>
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

          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                onClick={() => !tier.isTrial && setIsAnnual(tier.id === 'annual')}
                className={`flex flex-col justify-between backdrop-blur-sm bg-card/80 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  tier.id === 'annual' && isAnnual
                    ? 'ring-2 ring-primary shadow-lg shadow-indigo-500/10'
                    : tier.id === 'monthly' && !isAnnual
                    ? 'ring-2 ring-primary shadow-lg shadow-indigo-500/10'
                    : tier.isTrial
                    ? 'ring-2 ring-primary/30 shadow-lg shadow-indigo-500/5'
                    : 'hover:border-primary/50'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{tier.name}</CardTitle>
                    {tier.isPopular && (
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2.5 py-0.5 text-xs font-medium text-white">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4 flex flex-col">
                    {tier.id !== 'annual' && (
                      <div className="flex items-baseline gap-2">
                        {tier.price.original && (
                          <span className="text-lg font-semibold text-muted-foreground line-through">
                            {tier.price.original}
                          </span>
                        )}
                        <span className="text-4xl font-bold tracking-tight">
                          {tier.price.monthly}
                        </span>
                        <span className="ml-1 text-sm font-semibold leading-6 text-muted-foreground">
                          /month
                        </span>
                      </div>
                    )}
                    {tier.id === 'annual' && (
                      <>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-semibold text-muted-foreground line-through">
                            {tier.price.originalMonthly}
                          </span>
                          <span className="text-4xl font-bold tracking-tight">
                            {tier.price.monthly}
                          </span>
                          <span className="ml-1 text-sm font-semibold leading-6 text-muted-foreground">
                            /month
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-base font-semibold text-muted-foreground line-through">
                            {tier.price.originalAnnual}
                          </span>
                          <span className="text-base font-semibold text-muted-foreground">
                            {tier.price.annual}
                          </span>
                          <span className="ml-1 text-xs font-semibold leading-6 text-muted-foreground">
                            billed yearly
                          </span>
                        </div>
                      </>
                    )}
                    {tier.discount && (
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-2.5 py-0.5 text-xs font-bold text-white mt-2">
                        {tier.discount}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <div className="flex-none">
                          {tier.isTrial ? (
                            <div className="h-5 w-5 rounded-full flex items-center justify-center bg-primary/20">
                              <X className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        <span className={tier.isTrial ? 'text-primary/80' : ''}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      (tier.id === 'annual' && isAnnual) || (tier.id === 'monthly' && !isAnnual)
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0'
                        : tier.isTrial
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/20'
                        : ''
                    }`}
                    variant={tier.id === 'annual' && isAnnual || tier.id === 'monthly' && !isAnnual ? 'default' : 'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tier.isTrial) {
                        handleStartTrial();
                      } else if (tier.priceId) {
                        handleSubscribe(tier.priceId);
                      } else {
                        console.error('Price ID not found for tier:', tier.id);
                      }
                    }}
                    disabled={isLoading || isSessionLoading}
                  >
                    {isLoading || isSessionLoading ? 'Loading...' : tier.isTrial ? 'Try Free Trial' : 'Start branching'}
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