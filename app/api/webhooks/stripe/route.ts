import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { subscriptions, user } from '@/lib/db/schema';
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
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });

          // Clear free trial data
          await db
            .update(user)
            .set({
              freeTrialStartDate: null,
              freeTrialEndDate: null,
              chatCount: 0,
              lastChatReset: new Date(),
            })
            .where(eq(user.id, userId));

          console.log('Checkout completed for user:', userId, 'with status:', status);
        } catch (error) {
          console.error('Error processing checkout.session.completed:', error);
          throw error; // Re-throw to be caught by outer try-catch
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
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

          // If subscription is active, ensure free trial data is cleared
          if (status === 'active') {
            const [subscriptionRecord] = await db
              .select({ userId: subscriptions.userId })
              .from(subscriptions)
              .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

            if (subscriptionRecord) {
              await db
                .update(user)
                .set({
                  freeTrialStartDate: null,
                  freeTrialEndDate: null,
                  chatCount: 0,
                  lastChatReset: new Date(),
                })
                .where(eq(user.id, subscriptionRecord.userId));
            }
          }

          console.log('Subscription updated:', subscription.id, 'with status:', status);
        } catch (error) {
          console.error('Error processing customer.subscription.updated:', error);
          throw error; // Re-throw to be caught by outer try-catch
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
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: true,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

          console.log('Subscription cancelled:', subscription.id);
        } catch (error) {
          console.error('Error processing customer.subscription.deleted:', error);
          throw error; // Re-throw to be caught by outer try-catch
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
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