import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { and, eq, gt, lt } from 'drizzle-orm';
import { sendTrialMidpointEmail, sendTrialEndingEmail } from '@/lib/email';

async function handleTrialEmails() {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Get users who are halfway through their trial (7 days remaining)
  const usersAtMidpoint = await db
    .select({
      email: user.email,
      freeTrialEndDate: user.freeTrialEndDate,
    })
    .from(user)
    .where(
      and(
        gt(user.freeTrialEndDate, now),
        lt(user.freeTrialEndDate, sevenDaysFromNow)
      )
    );

  // Get users whose trial is ending soon (3 days remaining)
  const usersEndingSoon = await db
    .select({
      email: user.email,
      freeTrialEndDate: user.freeTrialEndDate,
    })
    .from(user)
    .where(
      and(
        gt(user.freeTrialEndDate, now),
        lt(user.freeTrialEndDate, threeDaysFromNow)
      )
    );

  // Send midpoint emails
  for (const user of usersAtMidpoint) {
    if (user.email && user.freeTrialEndDate) {
      await sendTrialMidpointEmail(user.email, user.freeTrialEndDate);
    }
  }

  // Send ending soon emails
  for (const user of usersEndingSoon) {
    if (user.email && user.freeTrialEndDate) {
      await sendTrialEndingEmail(user.email, user.freeTrialEndDate);
    }
  }

  return {
    success: true,
    midpointEmailsSent: usersAtMidpoint.length,
    endingSoonEmailsSent: usersEndingSoon.length,
  };
}

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await handleTrialEmails();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending trial emails:', error);
    return NextResponse.json(
      { error: 'Failed to send trial emails' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await handleTrialEmails();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending trial emails:', error);
    return NextResponse.json(
      { error: 'Failed to send trial emails' },
      { status: 500 }
    );
  }
} 