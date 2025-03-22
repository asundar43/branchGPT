import { auth } from '@/app/(auth)/auth';
import { checkFreeTrialStatus } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const trialStatus = await checkFreeTrialStatus(session.user.id);

    return NextResponse.json(trialStatus);
  } catch (error) {
    console.error('Error checking free trial status:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 