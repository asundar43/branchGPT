import { auth } from '@/app/(auth)/auth';
import { generateUUID } from '@/lib/utils';
import { saveChat, saveMessages, getChatById } from '@/lib/db/queries';
import { Message } from 'ai';
import { generateTitleFromUserMessage } from '../../actions';
import { branchConnection, type Message as DBMessage } from '@/lib/db/schema';
import { db } from '@/lib/db/index';

export async function POST(request: Request) {
  try {
    const { messages, messageId, chatId }: { messages: Array<Message>; messageId: string; chatId: string } =
      await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Find the index of the message to branch from
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) {
      return new Response('Message not found', { status: 404 });
    }

    // Create a new chat with messages up to the selected message
    const branchedMessages = messages.slice(0, messageIndex + 1);
    const newChatId = generateUUID();

    // Generate a title based on the message we're branching from
    const branchMessage = messages[messageIndex];
    const title = await generateTitleFromUserMessage({
      message: {
        id: generateUUID(),
        role: 'user',
        content: `Branch from: ${branchMessage.content}`,
      },
    });

    // Find the root chat (main chat) by traversing up the parent chain
    let currentChat = await getChatById({ id: chatId });
    let mainChatId = chatId;
    
    while (currentChat?.parentId) {
      mainChatId = currentChat.parentId;
      currentChat = await getChatById({ id: mainChatId });
    }

    // Save the new chat with parent reference to the main chat
    await saveChat({
      id: newChatId,
      userId: session.user.id,
      title,
      parentId: mainChatId,
    });

    // Save the branched messages
    const messageIds = branchedMessages.map(() => generateUUID());
    await saveMessages({
      messages: branchedMessages.map((message, index) => ({
        id: messageIds[index],
        chatId: newChatId,
        role: message.role,
        content: message.content,
        createdAt: new Date(),
      })),
    });

    // Create the branch connection
    await db.insert(branchConnection).values({
      mainChatId,
      branchChatId: newChatId,
      mainMessageId: messageId,
      branchMessageId: messageIds[0],
      createdAt: new Date(),
    });

    return Response.json({ chatId: newChatId }, { status: 200 });
  } catch (error) {
    console.error('Failed to branch chat:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 