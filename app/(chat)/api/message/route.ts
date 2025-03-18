import { auth } from '@/app/(auth)/auth';
import { db } from '@/lib/db/index';
import { message } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return new Response('Message ID is required', { status: 400 });
    }

    // Fetch the message from the database
    const messages = await db
      .select()
      .from(message)
      .where(eq(message.id, messageId));

    if (!messages.length) {
      return new Response('Message not found', { status: 404 });
    }

    return Response.json(messages[0]);
  } catch (error) {
    console.error('Failed to fetch message:', error);
    return new Response(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
} 