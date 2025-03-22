import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);
    const { userId } = body;

    if (!userId) {
      console.log('Missing userId in request');
      return NextResponse.json(
        { error: 'Missing required fields: userId' },
        { status: 400 }
      );
    }

    // Get the user's subscription
    console.log('Looking up subscription for user:', userId);
    const [userSubscription] = await db
      .select({
        stripe_customer_id: subscriptions.stripeCustomerId,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!userSubscription) {
      console.log('No subscription found for user:', userId);
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    console.log('Found subscription:', userSubscription);

    if (!userSubscription.stripe_customer_id) {
      console.log('No Stripe customer ID found for subscription');
      return NextResponse.json(
        { error: 'No Stripe customer ID found' },
        { status: 400 }
      );
    }

    // Create a Stripe Customer Portal session
    console.log('Creating portal session for customer:', userSubscription.stripe_customer_id);
    const session = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat`,
    });

    console.log('Created portal session:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create portal session' },
      { status: 500 }
    );
  }
} 