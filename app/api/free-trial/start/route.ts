import { auth } from '@/app/(auth)/auth';
import { startFreeTrial, checkFreeTrialStatus } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Please sign in to start your free trial' }, { status: 401 });
    }

    // Check if user already has an active trial
    const trialStatus = await checkFreeTrialStatus(session.user.id);
    if (trialStatus.isActive) {
      return NextResponse.json(
        { error: 'You already have an active free trial' },
        { status: 400 }
      );
    }

    await startFreeTrial(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error starting free trial:', error);
    return NextResponse.json(
      { error: 'Failed to start free trial. Please try again.' },
      { status: 500 }
    );
  }
} 