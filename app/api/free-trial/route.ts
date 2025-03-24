import { auth } from '@/app/(auth)/auth';
import { checkFreeTrialStatus, hasActiveSubscription, getUser } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
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

    // Check subscription status
    const hasSubscription = await hasActiveSubscription(userId);
    if (hasSubscription) {
      return NextResponse.json({
        isActive: false,
        hasSubscription: true
      });
    }

    // Check free trial status
    const trialStatus = await checkFreeTrialStatus(userId);
    return NextResponse.json({
      ...trialStatus,
      hasSubscription: false
    });
  } catch (error) {
    console.error('Error checking free trial status:', error);
    return NextResponse.json(
      { error: 'Failed to check free trial status' },
      { status: 500 }
    );
  }
} 