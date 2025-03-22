import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing stripe signature or webhook secret');
      return NextResponse.json(
        { error: 'Missing stripe signature or webhook secret' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        if (!userId) {
          console.error('No user ID in session');
          throw new Error('No user ID in session');
        }

        try {
          // Get the subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          // Map Stripe status to our enum
          const status = mapStripeStatus(subscription.status);
          
          // Insert subscription record
          await db.insert(subscriptions).values({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });

          console.log('Checkout completed for user:', userId, 'with status:', status);
        } catch (error) {
          console.error('Error processing checkout.session.completed:', error);
          // Don't throw here, just log the error
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        try {
          // Map Stripe status to our enum
          const status = mapStripeStatus(subscription.status);
          
          // Update subscription status
          await db
            .update(subscriptions)
            .set({
              status,
              current_period_start: new Date(subscription.current_period_start * 1000),
              current_period_end: new Date(subscription.current_period_end * 1000),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date(),
            })
            .where(eq(subscriptions.stripe_subscription_id, subscription.id));

          console.log('Subscription updated:', subscription.id, 'with status:', status);
        } catch (error) {
          console.error('Error processing customer.subscription.updated:', error);
          // Don't throw here, just log the error
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        try {
          // Update subscription status to canceled
          await db
            .update(subscriptions)
            .set({
              status: 'canceled',
              current_period_end: new Date(subscription.current_period_end * 1000),
              cancel_at_period_end: true,
              updated_at: new Date(),
            })
            .where(eq(subscriptions.stripe_subscription_id, subscription.id));

          console.log('Subscription cancelled:', subscription.id);
        } catch (error) {
          console.error('Error processing customer.subscription.deleted:', error);
          // Don't throw here, just log the error
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

function mapStripeStatus(stripeStatus: string): 'active' | 'canceled' | 'past_due' | 'unpaid' {
  switch (stripeStatus) {
    case 'active':
      return 'active';
    case 'canceled':
      return 'canceled';
    case 'past_due':
      return 'past_due';
    case 'unpaid':
      return 'unpaid';
    default:
      console.warn('Unknown Stripe status:', stripeStatus);
      return 'unpaid';
  }
} 