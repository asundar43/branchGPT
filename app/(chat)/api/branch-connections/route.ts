import { auth } from '@/app/(auth)/auth';
import { branchConnection } from '@/lib/db/schema';
import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mainChatId = searchParams.get('mainChatId');

    if (!mainChatId) {
      return new Response('Main chat ID is required', { status: 400 });
    }

    const session = await auth();
    if (!session || !session.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get all branch connections for this main chat
    const connections = await db
      .select({
        id: branchConnection.id,
        mainChatId: branchConnection.mainChatId,
        branchChatId: branchConnection.branchChatId,
        mainMessageId: branchConnection.mainMessageId,
        branchMessageId: branchConnection.branchMessageId,
        type: branchConnection.type,
        selectedText: branchConnection.selectedText,
        createdAt: branchConnection.createdAt,
      })
      .from(branchConnection)
      .where(eq(branchConnection.mainChatId, mainChatId));

    return Response.json(connections);
  } catch (error) {
    console.error('Failed to get branch connections:', error);
    return new Response(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
} 