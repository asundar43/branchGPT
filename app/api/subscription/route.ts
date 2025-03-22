import { auth } from '@/app/(auth)/auth';
import { hasActiveSubscription } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const hasSubscription = await hasActiveSubscription(session.user.id);

    return NextResponse.json({ hasActiveSubscription: hasSubscription });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 