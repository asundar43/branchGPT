import { auth } from '@/app/(auth)/auth';
import { branchConnection, type BranchConnection } from '@/lib/db/schema';
import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { mainChatId, branchChatId, mainMessageId, branchMessageId } = await request.json();

    const session = await auth();
    if (!session || !session.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Create the branch connection
    await db.insert(branchConnection).values({
      mainChatId,
      branchChatId,
      mainMessageId,
      branchMessageId,
      createdAt: new Date(),
    });

    return new Response('Branch connection created', { status: 200 });
  } catch (error) {
    console.error('Failed to create branch connection:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchChatId = searchParams.get('branchChatId');

    if (!branchChatId) {
      return new Response('Branch chat ID is required', { status: 400 });
    }

    const session = await auth();
    if (!session || !session.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get the branch connection
    const connection = await db
      .select()
      .from(branchConnection)
      .where(eq(branchConnection.branchChatId, branchChatId))
      .limit(1);

    if (!connection || connection.length === 0) {
      return new Response('Branch connection not found', { status: 404 });
    }

    return Response.json(connection[0]);
  } catch (error) {
    console.error('Failed to get branch connection:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 