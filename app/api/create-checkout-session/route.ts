import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);
    
    const { priceId, userId } = body;

    if (!priceId || !userId) {
      console.log('Missing fields:', { priceId, userId });
      return NextResponse.json(
        { error: `Missing required fields: ${!priceId ? 'priceId' : ''} ${!userId ? 'userId' : ''}` },
        { status: 400 }
      );
    }

    // Validate that the price ID exists
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log('Valid price found:', price.id);
    } catch (error) {
      console.error('Invalid price ID:', error);
      return NextResponse.json(
        { error: `Invalid price ID: ${priceId}` },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('NEXT_PUBLIC_APP_URL is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      client_reference_id: userId,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: undefined, // Will be set by Stripe if user is logged in
    });

    if (!session?.id) {
      console.error('No session ID in response:', session);
      throw new Error('Failed to create checkout session');
    }

    console.log('Successfully created session:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 