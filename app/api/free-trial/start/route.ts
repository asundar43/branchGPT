import { auth } from '@/app/(auth)/auth';
import { startFreeTrial, checkFreeTrialStatus, getUser } from '@/lib/db/queries';
import { NextResponse } from 'next/server';
import { sendTrialStartEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const session = await auth();
    console.log('Session:', session); // Debug log

    if (!session?.user?.email) {
      console.error('No user email in session');
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }

    // Get user ID from email since Google OAuth might not have ID set yet
    const users = await getUser(session.user.email);
    if (users.length === 0) {
      console.error('No user found for email:', session.user.email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = users[0].id;
    console.log('Found user ID:', userId); // Debug log

    // Check if user already has an active trial
    const trialStatus = await checkFreeTrialStatus(userId);
    if (trialStatus.isActive) {
      return NextResponse.json(
        { error: 'You already have an active free trial' },
        { status: 400 }
      );
    }

    try {
      const result = await startFreeTrial(userId);
      
      // Send welcome email
      if (result?.freeTrialEndDate) {
        await sendTrialStartEmail(session.user.email, result.freeTrialEndDate);
      }
      
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