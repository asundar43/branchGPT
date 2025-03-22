import { auth } from '@/app/(auth)/auth';
import { startFreeTrial, checkFreeTrialStatus } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // Check if user already has an active trial
    const trialStatus = await checkFreeTrialStatus(userId!);
    if (trialStatus.isActive) {
      return NextResponse.json(
        { error: 'You already have an active free trial' },
        { status: 400 }
      );
    }

    try {
      await startFreeTrial(userId!);
      return NextResponse.json({ success: true });
    } catch (error) {
      if (error instanceof Error && error.message.includes('active paid subscription')) {
        return NextResponse.json(
          { error: 'You already have an active paid subscription' },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error starting free trial:', error);
    return NextResponse.json(
      { error: 'Failed to start free trial. Please try again.' },
      { status: 500 }
    );
  }
} 