import { auth } from '@/app/(auth)/auth';
import { hasActiveSubscription } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isSubscribed = await hasActiveSubscription(session.user.id);

    return NextResponse.json({
      hasActiveSubscription: isSubscribed
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
} 