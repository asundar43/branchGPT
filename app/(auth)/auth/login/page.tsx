'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from '@/components/toast';
import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';
import { login, type LoginActionState } from '../../actions';
import { hasActiveSubscription, checkFreeTrialStatus } from '@/lib/db/queries';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(login, {
    status: 'idle',
  });

  useEffect(() => {
    if (state.status === 'failed') {
      toast({
        type: 'error',
        description: 'Invalid credentials!',
      });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      toast({
        type: 'success',
        description: 'Successfully signed in!',
      });
      
      // Check subscription status and redirect accordingly
      const checkSubscriptionAndRedirect = async () => {
        try {
          const response = await fetch('/api/free-trial');
          const trialStatus = await response.json();
          
          // If user has an active trial or subscription, redirect to chat
          if (trialStatus.isActive) {
            router.push('/chat');
          } else {
            // Check for active subscription
            const subscriptionResponse = await fetch('/api/subscription');
            const subscriptionData = await subscriptionResponse.json();
            
            if (subscriptionData.hasActiveSubscription) {
              router.push('/chat');
            } else {
              router.push('/pricing');
            }
          }
          router.refresh();
        } catch (error) {
          console.error('Error checking subscription:', error);
          router.push('/pricing');
        }
      };

      // Wait for the auth state to be updated before checking subscription
      setTimeout(checkSubscriptionAndRedirect, 500);
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
      <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
        <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Use your email and password to sign in
        </p>
      </div>
      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
        <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
          {"Don't have an account? "}
          <Link
            href="/auth/register"
            className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
          >
            Sign up
          </Link>
          {' for free.'}
        </p>
      </AuthForm>
    </div>
  );
} 