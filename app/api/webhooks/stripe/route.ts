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
      return NextResponse.json(
        { error: 'Missing stripe signature or webhook secret' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        if (!userId) {
          throw new Error('No user ID in session');
        }

        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        // Determine plan type from the price ID
        const priceId = subscription.items.data[0].price.id;
        const planType = priceId === process.env.STRIPE_MONTHLY_PRICE_ID ? 'monthly' : 'annual';

        // Insert subscription record
        await db.insert(subscriptions).values({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          plan_type: planType,
          status: 'active',
          start_date: new Date(subscription.current_period_start * 1000),
          end_date: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
        });

        console.log('Checkout completed for user:', userId);
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        await db
          .update(subscriptions)
          .set({
            status: subscription.status as 'active' | 'canceled' | 'past_due' | 'unpaid',
            end_date: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
          })
          .where(eq(subscriptions.stripe_subscription_id, subscription.id));

        console.log('Subscription updated:', subscription.id);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status to canceled
        await db
          .update(subscriptions)
          .set({
            status: 'canceled',
            end_date: new Date(subscription.current_period_end * 1000),
          })
          .where(eq(subscriptions.stripe_subscription_id, subscription.id));

        console.log('Subscription cancelled:', subscription.id);
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