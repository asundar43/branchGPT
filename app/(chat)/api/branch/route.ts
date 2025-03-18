import { auth } from '@/app/(auth)/auth';
import { generateUUID } from '@/lib/utils';
import { saveChat, saveMessages, getChatById } from '@/lib/db/queries';
import { Message } from 'ai';
import { generateTitleFromUserMessage } from '../../actions';
import { branchConnection } from '@/lib/db/schema';
import { db } from '@/lib/db/index';

export async function POST(request: Request) {
  try {
    const { messages, messageId, chatId, selectedText }: { 
      messages: Array<Message>; 
      messageId: string; 
      chatId: string;
      selectedText?: string;
    } = await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Find the message to branch from
    const branchMessage = messages.find((m) => m.id === messageId);
    if (!branchMessage) {
      return new Response('Message not found', { status: 404 });
    }

    const newChatId = generateUUID();

    // Generate a title based on the message we're branching from
    const title = await generateTitleFromUserMessage({
      message: {
        id: generateUUID(),
        role: 'user',
        content: selectedText 
          ? `Branch from: "${selectedText}"`
          : `Branch from: ${branchMessage.content}`,
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

    // Create the initial message for the branch
    const initialMessageId = generateUUID();
    const initialMessage: Message = {
      id: initialMessageId,
      role: branchMessage.role,
      content: selectedText || branchMessage.content,
      createdAt: new Date(),
    };

    // Save the initial message
    await saveMessages({
      messages: [{
        id: initialMessageId,
        chatId: newChatId,
        role: initialMessage.role,
        content: initialMessage.content,
        createdAt: new Date(),
      }],
    });

    // Create the branch connection
    await db.insert(branchConnection).values({
      mainChatId,
      branchChatId: newChatId,
      mainMessageId: messageId,
      branchMessageId: initialMessageId,
      type: selectedText ? 'highlight' : 'message',
      selectedText: selectedText || null,
      createdAt: new Date(),
    });

    return Response.json({ chatId: newChatId }, { status: 200 });
  } catch (error) {
    console.error('Failed to branch chat:', error);
    return new Response(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    );
  }
} 