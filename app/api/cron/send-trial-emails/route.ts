import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { eq, and, gte, lt } from 'drizzle-orm';
import { sendTrialStartEmail, sendTrialMidpointEmail, sendTrialEndingEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Get all users with active trials
    const usersWithTrials = await db
      .select({
        id: user.id,
        email: user.email,
        freeTrialStartDate: user.freeTrialStartDate,
        freeTrialEndDate: user.freeTrialEndDate,
      })
      .from(user)
      .where(
        and(
          gte(user.freeTrialStartDate, startOfDay),
          lt(user.freeTrialStartDate, endOfDay)
        )
      );

    for (const user of usersWithTrials) {
      if (!user.freeTrialStartDate || !user.freeTrialEndDate) continue;

      const startDate = new Date(user.freeTrialStartDate);
      const endDate = new Date(user.freeTrialEndDate);
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Send trial start email on day 1
      if (startDate.toDateString() === now.toDateString()) {
        await sendTrialStartEmail(user.email, daysRemaining);
      }
      // Send midpoint email on day 7
      else if (daysRemaining === 7) {
        await sendTrialMidpointEmail(user.email, daysRemaining);
      }
      // Send ending soon email on day 3
      else if (daysRemaining === 3) {
        await sendTrialEndingEmail(user.email, daysRemaining);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending trial emails:', error);
    return NextResponse.json(
      { error: 'Failed to send trial emails' },
      { status: 500 }
    );
  }
} 